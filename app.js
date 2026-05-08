const sourceText = document.querySelector("#sourceText");
const analyzeButton = document.querySelector("#analyzeButton");
const clearButton = document.querySelector("#clearButton");
const sampleButton = document.querySelector("#sampleButton");
const statusLine = document.querySelector("#statusLine");

const personaName = document.querySelector("#personaName");
const blendLabel = document.querySelector("#blendLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const scoreMeter = document.querySelector("#scoreMeter");
const traits = document.querySelector("#traits");
const catchphrase = document.querySelector("#catchphrase");
const specialMove = document.querySelector("#specialMove");
const weakness = document.querySelector("#weakness");
const reviewLine = document.querySelector("#reviewLine");
const dangerWords = document.querySelector("#dangerWords");
const midnightCommit = document.querySelector("#midnightCommit");
const pairBuddy = document.querySelector("#pairBuddy");
const slackStamp = document.querySelector("#slackStamp");
const personaFace = document.querySelector("#personaFace");

const personas = [
  {
    id: "firefighter",
    name: "火消し職人タイプ",
    words: ["fix", "hotfix", "patch", "urgent", "temp", "todo", "try", "catch", "rollback", "暫定", "緊急"],
    catchphrase: "「まず止血します。話はそれからです」",
    specialMove: "障害ログから最短ルートで原因に飛ぶ",
    weakness: "未来の自分に小さな請求書を送りがち",
    reviewLine: "「ここ、暫定なら期限か撤去条件だけ置きたいです」",
    buddy: "落ち着いた設計整理役",
    stamp: ":ship_it_before_dawn:",
    color: "#e4572e",
    accent: "#f2c14e",
    expression: "tired-smile",
  },
  {
    id: "architect",
    name: "設計思想つよつよタイプ",
    words: ["interface", "abstract", "factory", "adapter", "layer", "domain", "architecture", "strategy", "DI", "設計"],
    catchphrase: "「ここは責務を分けておきたいですね」",
    specialMove: "まだ来ていない要件にも椅子を用意する",
    weakness: "小さな釘を打つために建築基準法を召喚する",
    reviewLine: "「依存の向きだけ先に整えると後が楽そうです」",
    buddy: "実装を前に進めるプロトタイパー",
    stamp: ":interface_energy:",
    color: "#4b6cb7",
    accent: "#7bdff2",
    expression: "confident",
  },
  {
    id: "scientist",
    name: "実験科学者タイプ",
    words: ["test", "experiment", "poc", "maybe", "draft", "trial", "hypothesis", "検証", "実験", "仮説"],
    catchphrase: "「一回小さく試してみます」",
    specialMove: "謎をミニ実験に分解する",
    weakness: "実験場の看板を外し忘れる",
    reviewLine: "「この仮説、ログで見える形にしておくと強そう」",
    buddy: "片付け上手なリリース管理役",
    stamp: ":poc_wa_uso_tsukanai:",
    color: "#0b7a75",
    accent: "#f2c14e",
    expression: "curious",
  },
  {
    id: "namer",
    name: "命名あきらめタイプ",
    words: ["data", "info", "result", "tmp", "flag", "obj", "val", "misc", "thing", "stuff"],
    catchphrase: "「中身はわかってるんです。名前がまだです」",
    specialMove: "曖昧な概念をとりあえず動かす",
    weakness: "三日後の自分が `result2` を見つめる",
    reviewLine: "「この `data` だけ、役割が出る名前にできそうです」",
    buddy: "語彙が強いドメイン職人",
    stamp: ":naming_is_hard:",
    color: "#6f5f90",
    accent: "#f7b2bd",
    expression: "blank",
  },
  {
    id: "reviewer",
    name: "几帳面レビュワータイプ",
    words: ["refactor", "docs", "readme", "spec", "coverage", "assert", "lint", "format", "chore", "テスト"],
    catchphrase: "「小さく分けるとレビューしやすいです」",
    specialMove: "未来の同僚に親切な差分を残す",
    weakness: "完璧な説明を待つ間に昼が終わる",
    reviewLine: "「このケースもテストに足しておくと安心です」",
    buddy: "勢いよく作る一撃必殺役",
    stamp: ":lg_with_context:",
    color: "#2a9d8f",
    accent: "#e9c46a",
    expression: "gentle",
  },
  {
    id: "one-shot",
    name: "一撃必殺タイプ",
    words: ["initial commit", "big update", "rewrite", "massive", "all", "wip", "first", "全部", "一旦"],
    catchphrase: "「動くところまで持ってきました」",
    specialMove: "何もない場所に急に世界を置く",
    weakness: "レビュー画面のスクロールバーが細い線になる",
    reviewLine: "「分けられるところだけ後追いで切り出しましょう」",
    buddy: "差分を整える几帳面レビュワー",
    stamp: ":diff_ha_yama:",
    color: "#bc4749",
    accent: "#a7c957",
    expression: "wild",
  },
  {
    id: "defender",
    name: "防御力高めタイプ",
    words: ["validation", "error", "retry", "timeout", "guard", "fallback", "sanitize", "exception", "監視", "防御"],
    catchphrase: "「壊れる前提で考えましょう」",
    specialMove: "本番の嫌な沈黙を先回りして潰す",
    weakness: "正常系が肩身狭そうにしている",
    reviewLine: "「失敗時の戻り値とログだけ確認したいです」",
    buddy: "体験を磨く UI こだわり職人",
    stamp: ":timeout_wo_yurusanai:",
    color: "#264653",
    accent: "#2a9d8f",
    expression: "serious",
  },
  {
    id: "ui-craft",
    name: "UI こだわり職人タイプ",
    words: ["css", "animation", "spacing", "color", "hover", "focus", "pixel", "layout", "radius", "余白"],
    catchphrase: "「あと 1px だけ詰めたいです」",
    specialMove: "違和感を見つけて気持ちよさに変える",
    weakness: "API の 500 に対して少し寛容",
    reviewLine: "「ホバーとフォーカス時の見え方も合わせたいです」",
    buddy: "防御力高めのバックエンド役",
    stamp: ":one_px_matter:",
    color: "#ff8fab",
    accent: "#80ed99",
    expression: "sparkle",
  },
  {
    id: "abstraction",
    name: "抽象化しがちタイプ",
    words: ["helper", "manager", "service", "utils", "common", "shared", "base", "core", "wrapper", "共通"],
    catchphrase: "「共通化できますね」",
    specialMove: "重複を見ると自然に手が動く",
    weakness: "祖国が増えすぎて国境管理が大変",
    reviewLine: "「この helper の責務、もう少し狭めてもよさそうです」",
    buddy: "現場感のあるプロダクト判断役",
    stamp: ":utils_no_mori:",
    color: "#577590",
    accent: "#f8961e",
    expression: "thinking",
  },
  {
    id: "readme-poet",
    name: "README 詩人タイプ",
    words: ["readme", "vision", "roadmap", "concept", "philosophy", "overview", "guide", "mission", "思想", "概要"],
    catchphrase: "「思想から説明します」",
    specialMove: "まだない機能の輪郭を美しく語る",
    weakness: "コードより先に世界観がデプロイされる",
    reviewLine: "「README と実装の距離だけ少し縮めたいです」",
    buddy: "黙って動くものを作る実装突破役",
    stamp: ":readme_ga_hikatteru:",
    color: "#8a5a44",
    accent: "#90be6d",
    expression: "dreamy",
  },
];

const dangerLexicon = ["TODO", "FIXME", "HACK", "temp", "any", "catch (e) {}", "console.log", "big update", "WIP", "一旦"];

const sample = `commit 9f00d: hotfix timeout retry around payment callback
TODO remove temp flag after release
try {
  await service.manager.handle(data, info)
} catch (e) {}

refactor: add validation, fallback, and tests for edge cases
css: adjust hover spacing by 1px because it looked haunted at 2am`;

function normalize(text) {
  return text.toLowerCase();
}

function countNeedles(haystack, words) {
  return words.reduce((total, word) => {
    const pattern = word.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return total + (haystack.match(new RegExp(pattern, "g")) || []).length;
  }, 0);
}

function analyze(text) {
  const normalized = normalize(text);
  const lengthBonus = Math.min(16, Math.floor(text.length / 180));
  const lineBonus = Math.min(10, text.split(/\r?\n/).filter(Boolean).length);
  const ranked = personas
    .map((persona) => ({
      ...persona,
      score: countNeedles(normalized, persona.words) * 12 + lengthBonus + lineBonus,
    }))
    .sort((a, b) => b.score - a.score);

  const primary = ranked[0];
  const secondary = ranked.find((item) => item.id !== primary.id) || ranked[1];
  const rawScore = ranked.slice(0, 3).reduce((sum, item, index) => sum + Math.max(0, item.score - index * 5), 0);
  const score = Math.max(12, Math.min(99, rawScore));
  const primaryRatio = Math.max(55, Math.min(88, Math.round(70 + (primary.score - secondary.score) / 2)));
  const foundDangerWords = dangerLexicon.filter((word) => normalized.includes(word.toLowerCase()));

  return {
    primary,
    secondary,
    score,
    primaryRatio,
    secondaryRatio: 100 - primaryRatio,
    foundDangerWords,
    ranked: ranked.slice(0, 4),
  };
}

function renderChips(container, items, emptyLabel) {
  container.innerHTML = "";
  const list = items.length ? items : [emptyLabel];
  list.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = item;
    container.appendChild(chip);
  });
}

function renderTraits(items) {
  traits.innerHTML = "";
  items.forEach((item) => {
    const trait = document.createElement("span");
    trait.className = "trait";
    const label = item.label || item.name || "気配";
    trait.textContent = `${label.replace("タイプ", "")}: ${Math.round(item.score)}`;
    traits.appendChild(trait);
  });
}

function facePath(expression) {
  const mouths = {
    "tired-smile": "M122 218 C145 232 178 232 198 216",
    confident: "M122 212 C148 226 180 226 204 212",
    curious: "M128 218 C145 208 174 208 194 218",
    blank: "M132 218 L194 218",
    gentle: "M126 214 C148 232 178 232 200 214",
    wild: "M126 218 C150 244 184 198 204 222",
    serious: "M128 224 C150 216 176 216 198 224",
    sparkle: "M122 214 C146 236 184 236 206 214",
    thinking: "M132 220 C150 214 170 226 192 218",
    dreamy: "M126 216 C150 228 176 228 202 216",
  };
  return mouths[expression] || mouths.gentle;
}

function eyeMarkup(expression) {
  if (expression === "blank") {
    return `<line x1="102" y1="142" x2="132" y2="142" stroke="#1e2420" stroke-width="8" stroke-linecap="round"/>
      <line x1="190" y1="142" x2="220" y2="142" stroke="#1e2420" stroke-width="8" stroke-linecap="round"/>`;
  }
  if (expression === "sparkle") {
    return `<path d="M116 124 L123 140 L140 146 L123 152 L116 168 L109 152 L92 146 L109 140 Z" fill="#fff"/>
      <path d="M204 124 L211 140 L228 146 L211 152 L204 168 L197 152 L180 146 L197 140 Z" fill="#fff"/>`;
  }
  if (expression === "serious") {
    return `<circle cx="116" cy="146" r="11" fill="#1e2420"/><circle cx="204" cy="146" r="11" fill="#1e2420"/>
      <line x1="96" y1="126" x2="132" y2="136" stroke="#1e2420" stroke-width="7" stroke-linecap="round"/>
      <line x1="188" y1="136" x2="224" y2="126" stroke="#1e2420" stroke-width="7" stroke-linecap="round"/>`;
  }
  return `<circle cx="116" cy="146" r="12" fill="#1e2420"/><circle cx="204" cy="146" r="12" fill="#1e2420"/>`;
}

function safeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;
}

function renderFace(primary, secondary, score) {
  const hairTilt = score % 2 === 0 ? -8 : 8;
  const primaryColor = safeColor(primary.color, "#0b7a75");
  const secondaryColor = safeColor(secondary.color, "#577590");
  const primaryAccent = safeColor(primary.accent, "#f2c14e");
  const secondaryAccent = safeColor(secondary.accent, "#e9c46a");
  personaFace.innerHTML = `
    <title id="faceTitle">生成されたペルソナの顔</title>
    <desc id="faceDesc">${primary.name} の雰囲気を持つキャラクター</desc>
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="${primaryAccent}"/>
        <stop offset="100%" stop-color="${secondaryColor}"/>
      </linearGradient>
      <linearGradient id="faceTone" x1="0" x2="1">
        <stop offset="0%" stop-color="#ffd8b8"/>
        <stop offset="100%" stop-color="#f5b889"/>
      </linearGradient>
    </defs>
    <rect width="320" height="320" fill="url(#bg)"/>
    <circle cx="82" cy="74" r="34" fill="rgba(255,255,255,.25)"/>
    <circle cx="252" cy="246" r="48" fill="rgba(255,255,255,.2)"/>
    <path d="M82 136 C84 72 234 72 238 136 L238 184 C238 238 206 272 160 272 C114 272 82 238 82 184 Z" fill="url(#faceTone)" stroke="#1e2420" stroke-width="6"/>
    <path d="M83 135 C94 64 221 55 243 135 C213 112 181 104 139 112 C113 118 98 128 83 135 Z" fill="${primaryColor}" stroke="#1e2420" stroke-width="6" transform="rotate(${hairTilt} 160 116)"/>
    ${eyeMarkup(primary.expression)}
    <path d="M160 158 C154 176 153 184 164 186" fill="none" stroke="#1e2420" stroke-width="6" stroke-linecap="round"/>
    <path d="${facePath(primary.expression)}" fill="none" stroke="#1e2420" stroke-width="7" stroke-linecap="round"/>
    <circle cx="90" cy="186" r="13" fill="${secondaryAccent}" opacity=".75"/>
    <circle cx="230" cy="186" r="13" fill="${secondaryAccent}" opacity=".75"/>
    <rect x="74" y="262" width="172" height="34" rx="17" fill="${primaryColor}" stroke="#1e2420" stroke-width="6"/>
  `;
}

function midnightLine(primary, secondary) {
  const verbs = {
    firefighter: "fix-final-final-timeout",
    architect: "introduce-universal-adapter-layer",
    scientist: "try-maybe-real-experiment",
    namer: "rename-data-to-new-data",
    reviewer: "add-test-for-the-test",
    "one-shot": "big-update-sorry",
    defender: "handle-everything-that-can-fail",
    "ui-craft": "move-button-one-pixel",
    abstraction: "extract-common-manager-helper-service",
    "readme-poet": "document-the-dream",
  };
  return `commit: ${verbs[primary.id]} with ${secondary.id}`;
}

function setStatus(message, tone = "idle") {
  statusLine.textContent = message;
  statusLine.dataset.tone = tone;
}

function renderEmpty() {
  personaName.textContent = "未召喚";
  blendLabel.textContent = "主人格 70% + 隠れ人格 30%";
  scoreLabel.textContent = "0";
  scoreMeter.style.width = "0%";
  traits.innerHTML = "";
  catchphrase.textContent = "貼り付け待ち。";
  specialMove.textContent = "まだ発動していない。";
  weakness.textContent = "入力からにじみ出る気配を待っている。";
  reviewLine.textContent = "「ここ、意図だけ少し足しておくと未来が助かりそう」";
  renderChips(dangerWords, [], "まだ平穏");
  midnightCommit.textContent = "commit: summon-persona";
  pairBuddy.textContent = "ログを貼ると現れる。";
  slackStamp.textContent = ":waiting_for_diff:";
  renderFace(personas[2], personas[4], 0);
  setStatus("ローカル診断で待機中。API サーバー起動時は LLM 診断を使います。");
}

function renderLocal(text, statusMessage = "ローカル診断を表示中。人格を錬成すると LLM 診断を試します。") {
  const result = analyze(text);
  personaName.textContent = result.primary.name;
  blendLabel.textContent = `主人格 ${result.primaryRatio}% + 隠れ人格 ${result.secondaryRatio}%: ${result.secondary.name.replace("タイプ", "")}`;
  scoreLabel.textContent = result.score;
  scoreMeter.style.width = `${result.score}%`;
  renderTraits(result.ranked);
  catchphrase.textContent = result.primary.catchphrase;
  specialMove.textContent = result.primary.specialMove;
  weakness.textContent = result.primary.weakness;
  reviewLine.textContent = result.primary.reviewLine;
  renderChips(dangerWords, result.foundDangerWords, "危険ワードなし");
  midnightCommit.textContent = midnightLine(result.primary, result.secondary);
  pairBuddy.textContent = result.primary.buddy;
  slackStamp.textContent = result.primary.stamp;
  renderFace(result.primary, result.secondary, result.score);
  setStatus(statusMessage);
}

function renderApiPersona(payload) {
  const data = payload.persona;
  const face = data.face || {};
  const primary = {
    name: data.personaName,
    color: face.primaryColor,
    accent: face.accentColor,
    expression: face.expression,
  };
  const secondary = {
    color: face.secondaryColor,
    accent: face.accentColor,
  };

  personaName.textContent = data.personaName;
  blendLabel.textContent = `主人格 ${data.primaryPersona.ratio}%: ${data.primaryPersona.label} + 隠れ人格 ${data.hiddenPersona.ratio}%: ${data.hiddenPersona.label}`;
  scoreLabel.textContent = data.score;
  scoreMeter.style.width = `${data.score}%`;
  renderTraits(data.traits || []);
  catchphrase.textContent = data.catchphrase;
  specialMove.textContent = data.specialMove;
  weakness.textContent = data.weakness;
  reviewLine.textContent = data.reviewLine;
  renderChips(dangerWords, data.dangerWords || [], "危険ワードなし");
  midnightCommit.textContent = data.midnightCommit;
  pairBuddy.textContent = data.pairBuddy;
  slackStamp.textContent = data.slackStamp;
  renderFace(primary, secondary, data.score);
  setStatus(`LLM 診断完了: ${payload.model}`, "success");
}

function update() {
  const text = sourceText.value.trim();
  if (!text) {
    renderEmpty();
    return;
  }

  renderLocal(text);
}

async function analyzeWithApi() {
  const text = sourceText.value.trim();
  if (!text) {
    renderEmpty();
    sourceText.focus();
    return;
  }

  analyzeButton.disabled = true;
  analyzeButton.textContent = "錬成中...";
  setStatus("LLM 診断中。入力テキストを /api/persona に送信しています。", "loading");

  try {
    const response = await fetch("/api/persona", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input: text }),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "API request failed");
    }

    renderApiPersona(payload);
  } catch (error) {
    renderLocal(text, `API 診断に失敗したためローカル診断を表示中: ${error.message}`);
    statusLine.dataset.tone = "error";
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.textContent = "人格を錬成";
  }
}

analyzeButton.addEventListener("click", analyzeWithApi);
sourceText.addEventListener("input", update);
clearButton.addEventListener("click", () => {
  sourceText.value = "";
  update();
  sourceText.focus();
});
sampleButton.addEventListener("click", () => {
  sourceText.value = sample;
  update();
});

update();
