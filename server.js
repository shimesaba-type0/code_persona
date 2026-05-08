import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 3000);
const model = process.env.OPENAI_MODEL || "gpt-5.4-nano";
const maxInputChars = 24000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

const personaSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "personaName",
    "primaryPersona",
    "hiddenPersona",
    "score",
    "traits",
    "evidence",
    "catchphrase",
    "specialMove",
    "weakness",
    "reviewLine",
    "dangerWords",
    "midnightCommit",
    "pairBuddy",
    "slackStamp",
    "face",
  ],
  properties: {
    personaName: { type: "string" },
    primaryPersona: {
      type: "object",
      additionalProperties: false,
      required: ["label", "ratio"],
      properties: {
        label: { type: "string" },
        ratio: { type: "integer", minimum: 0, maximum: 100 },
      },
    },
    hiddenPersona: {
      type: "object",
      additionalProperties: false,
      required: ["label", "ratio"],
      properties: {
        label: { type: "string" },
        ratio: { type: "integer", minimum: 0, maximum: 100 },
      },
    },
    score: { type: "integer", minimum: 0, maximum: 100 },
    traits: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "score"],
        properties: {
          label: { type: "string" },
          score: { type: "integer", minimum: 0, maximum: 100 },
        },
      },
    },
    evidence: {
      type: "array",
      items: { type: "string" },
    },
    catchphrase: { type: "string" },
    specialMove: { type: "string" },
    weakness: { type: "string" },
    reviewLine: { type: "string" },
    dangerWords: {
      type: "array",
      items: { type: "string" },
    },
    midnightCommit: { type: "string" },
    pairBuddy: { type: "string" },
    slackStamp: { type: "string" },
    face: {
      type: "object",
      additionalProperties: false,
      required: ["expression", "primaryColor", "secondaryColor", "accentColor", "mood"],
      properties: {
        expression: {
          type: "string",
          enum: [
            "tired-smile",
            "confident",
            "curious",
            "blank",
            "gentle",
            "wild",
            "serious",
            "sparkle",
            "thinking",
            "dreamy",
          ],
        },
        primaryColor: { type: "string" },
        secondaryColor: { type: "string" },
        accentColor: { type: "string" },
        mood: { type: "string" },
      },
    },
  },
};

const systemPrompt = `あなたは「コードの背後にいる人」というデモアプリの診断エンジンです。
入力されたコード、git log、レビューコメント、障害対応ログから、その入力テキストに残った開発スタイルの気配を、遊び心のある架空ペルソナとして JSON で返してください。

安全なトーン:
- 実在の個人そのものを断定しない。
- 「あなたはこういう人」ではなく「このコード片から召喚された人格」として扱う。
- 攻撃、人格否定、差別、属性推測をしない。
- 根拠は入力テキスト内の語彙、構造、コミット文、ログの傾向だけにする。
- 辛口でも愛があり、Codex meetup の会場で笑える表現にする。
- secret、token、password などの危険語があれば dangerWords に入れるが、値そのものは出力しない。

出力は必ずスキーマに従う JSON にしてください。`;

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > maxInputChars + 2000) {
      throw Object.assign(new Error("Request body is too large."), { status: 413 });
    }
  }
  return JSON.parse(body || "{}");
}

function extractOutputText(apiResponse) {
  if (typeof apiResponse.output_text === "string") {
    return apiResponse.output_text;
  }

  for (const item of apiResponse.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") {
        return content.text;
      }
    }
  }

  return "";
}

async function createPersona(input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("OPENAI_API_KEY is not set."), { status: 503 });
  }

  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `以下の入力から、架空の開発者ペルソナを生成してください。\n\n${input}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "code_persona",
          strict: true,
          schema: personaSchema,
        },
      },
    }),
  });

  const payload = await apiResponse.json();
  if (!apiResponse.ok) {
    const message = payload?.error?.message || "OpenAI API request failed.";
    throw Object.assign(new Error(message), { status: apiResponse.status });
  }

  const text = extractOutputText(payload);
  if (!text) {
    throw Object.assign(new Error("OpenAI API returned no JSON text."), { status: 502 });
  }

  return JSON.parse(text);
}

async function handlePersona(request, response) {
  try {
    const { input } = await readJson(request);
    if (typeof input !== "string" || input.trim().length === 0) {
      sendJson(response, 400, { error: "input is required" });
      return;
    }

    if (input.length > maxInputChars) {
      sendJson(response, 413, { error: `input must be ${maxInputChars} characters or fewer` });
      return;
    }

    const persona = await createPersona(input.trim());
    sendJson(response, 200, { source: "openai", model, persona });
  } catch (error) {
    const status = error.status || 500;
    sendJson(response, status, {
      error: error.message || "Unexpected server error.",
      source: "server",
    });
  }
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = normalize(decodeURIComponent(pathname))
    .replace(/^[/\\]+/, "")
    .replace(/^(\.\.[/\\])+/, "");
  const filePath = join(__dirname, safePath);

  if (!filePath.startsWith(__dirname)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
    });
    response.end(content);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

createServer((request, response) => {
  if (request.method === "POST" && request.url === "/api/persona") {
    handlePersona(request, response);
    return;
  }

  if (request.method === "GET" || request.method === "HEAD") {
    serveStatic(request, response);
    return;
  }

  response.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
  response.end("Method not allowed");
}).listen(port, () => {
  console.log(`Code Persona server running at http://localhost:${port}`);
});
