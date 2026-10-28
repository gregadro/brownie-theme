// Builds docs/index.html, the GitHub Pages landing page.

import { editorCSS, editorHTML } from "./editor.mjs";
import { FONTS_URL, PAGE, fontStacks, dripPath, sprinkles, esc, nameFor } from "./shared.mjs";

const pageVars = (t) =>
  `--page:${t.page};--tray:${t.tray};--ink:${t.ink};--ink-2:${t.ink2};--ink-3:${t.ink3};--line:${t.line};--caramel:${t.caramel};--orange:${t.orange};--butter:${t.butter};--on-butter:${t.onButter}`;

const ROLE_LABELS = {
  bg: "Editor background",
  fg: "Text",
  kw: "Keywords & tags",
  fn: "Functions",
  prop: "Properties",
  status: "Status bar",
  comment: "Comments",
  str: "Strings",
  num: "Numbers",
  type: "Classes & types",
  param: "Parameters",
  re: "Regex & escapes",
};

const FLAVOR_NOTES = {
  "salted-caramel": "The original recipe. Pistachio strings, raspberry numbers, wildflower honey for types and a pinch of sea salt on every regular expression.",
  "berries-cream": "Closest to the 2022 bake: strings stay peach cream, with blueberry numbers, strawberry types and a sprig of mint.",
  "pistachio-cherry": "The brightest box in the shop. Pistachio mint, black cherry, lemon custard and a few blueberries.",
};

export function buildSite({ variants, codes, keyOf, cssThemes, settingsHTML, version }) {
  const flavors = [...new Map(variants.map((v) => [v.flavor.id, v.flavor])).values()];
  const langs = Object.keys(codes);

  const editors = langs
    .map((lang, i) => {
      const c = codes[lang];
      return `<div class="code-set" data-lang="${lang}"${i ? " hidden" : ""}>${editorHTML({
        key: keyOf("salted-caramel", "dark"),
        fileName: c.file,
        codeHTML: c.html,
        lang: c.label,
        themeName: "Brownie",
        highlight: c.highlight,
      })}</div>`;
    })
    .join("");

  const jarSets = variants
    .map((v) => {
      const base = ["bg", "fg", "kw", "fn", "prop", "status", "comment"].map((role) => ({
        role,
        hex: v.p[role],
        name: nameFor(v.names[role], v.type),
      }));
      const sweet = ["str", "num", "type", "param", "re"].map((role) => ({
        role,
        hex: v.p[role],
        name: nameFor(v.flavor.names[role], v.type),
      }));
      const jar = (j) => `<li><button type="button" class="jar" data-hex="${j.hex}">
          <span class="swatch" style="background:${j.hex}"></span>
          <span class="jar-name">${esc(j.name)}</span>
          <span class="jar-role">${ROLE_LABELS[j.role]}</span>
          <code class="jar-hex">${j.hex}</code>
        </button></li>`;
      return `<div class="jar-set" data-flavor="${v.flavor.id}" data-bake="${v.type}" hidden>
        <div class="shelf"><h3>Every box</h3><ul class="jars">${base.map(jar).join("")}</ul></div>
        <div class="shelf"><h3>${esc(v.flavor.title)}</h3><ul class="jars">${sweet.map(jar).join("")}</ul></div>
      </div>`;
    })
    .join("");

  const boxes = flavors
    .map((f, i) => {
      const dots = ["str", "num", "type", "param", "re"]
        .map((r) => `<i style="background:${f.dark[r]}" data-dark="${f.dark[r]}" data-light="${f.light[r]}"></i>`)
        .join("");
      return `<button type="button" class="box" data-flavor="${f.id}" aria-pressed="${i === 0}">
        <span class="box-dots">${dots}</span>
        <span class="box-title">${esc(f.title)}</span>
        <span class="box-note">${esc(FLAVOR_NOTES[f.id])}</span>
        <span class="box-names"><code>${f.default ? "Brownie" : "Brownie " + esc(f.title)}</code><code>${f.default ? "Blondie" : "Blondie " + esc(f.title)}</code></span>
      </button>`;
    })
    .join("");

  const langTabs = langs
    .map((l, i) => `<button type="button" role="tab" data-lang="${l}" aria-selected="${i === 0}">${codes[l].label}</button>`)
    .join("");

  const heroSprinkles = sprinkles(
    [...new Set(flavors.flatMap((f) => [f.dark.str, f.dark.num, f.dark.type, f.dark.re]))],
    { count: 26, seed: 11, avoid: [[2, 6, 46, 94]] }
  );

  return `<!doctype html>
<html lang="en" data-bake="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Brownie · VS Code theme</title>
<meta name="description" content="A warm, colorful VS Code theme that tastes like a salted caramel brownie. Three flavors, each as a dark Brownie and a light Blondie.">
<meta property="og:title" content="Brownie · VS Code theme">
<meta property="og:description" content="Warm, colorful and calm. Three flavors, each as a dark Brownie and a light Blondie.">
<meta property="og:image" content="https://raw.githubusercontent.com/gregadro/brownie-theme/main/docs/images/hero.png">
<link rel="icon" href="icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS_URL}">
<script>
  try {
    var saved = localStorage.getItem("bake");
    var bake = saved || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.bake = bake;
  } catch (e) {}
</script>
<style>
:root{${fontStacks}${pageVars(PAGE.dark)};color-scheme:dark}
:root[data-bake="light"]{${pageVars(PAGE.light)};color-scheme:light}
${cssThemes}
${editorCSS}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--page);color:var(--ink);font:16px/1.6 var(--ui-font);-webkit-font-smoothing:antialiased;transition:background-color .35s,color .35s}
a{color:var(--caramel);text-underline-offset:3px}
a:hover{color:var(--orange)}
:focus-visible{outline:2px solid var(--caramel);outline-offset:3px;border-radius:4px}
.wrap{max-width:1180px;margin:0 auto;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
h1,h2,h3{font-family:var(--display);font-weight:400;line-height:1.05;margin:0;text-wrap:balance}
code{font-family:var(--code-font);font-size:.9em}
.hand{font-family:var(--hand);font-size:23px;line-height:1.1;color:var(--caramel)}
.eyebrow{font:500 13px var(--code-font);letter-spacing:.06em;color:var(--ink-3)}

/* top */
.top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-block:22px}
.brand{display:flex;align-items:center;gap:10px;color:var(--ink);text-decoration:none;font-family:var(--display);font-size:21px}
.brand img{width:34px;height:34px}
.top nav{display:flex;gap:22px;align-items:center;font-size:15px}
.top nav a{color:var(--ink-2);text-decoration:none}
.top nav a:hover{color:var(--ink)}

/* oven light switch */
.bake{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:3px;background:var(--tray)}
.bake button{appearance:none;border:0;background:transparent;color:var(--ink-2);font:500 14px var(--ui-font);padding:6px 14px;border-radius:999px;cursor:pointer}
.bake button[aria-pressed="true"]{background:var(--butter);color:var(--on-butter)}

/* hero */
.hero{position:relative;padding-block:40px 110px;overflow:hidden}
.hero .wrap{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,7fr);gap:48px;align-items:center;position:relative;z-index:1}
.hero h1{font-size:clamp(60px,8vw,108px);letter-spacing:-.02em}
.hero h1 span{display:block;font-size:.34em;letter-spacing:0;color:var(--ink-2);margin-top:14px;line-height:1.2}
.hero p{font-size:19px;color:var(--ink-2);max-width:34ch;margin:22px 0 0}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px;align-items:center}
.btn{display:inline-flex;align-items:center;gap:10px;background:var(--caramel);color:var(--tray);text-decoration:none;font-weight:600;padding:13px 22px;border-radius:999px;transition:transform .15s,background-color .15s}
.btn:hover{background:var(--orange);color:var(--tray);transform:translateY(-1px)}
.cmd{display:inline-flex;align-items:center;gap:10px;border:1px dashed var(--line);border-radius:999px;padding:11px 16px;background:transparent;color:var(--ink-2);font:13.5px var(--code-font);cursor:pointer}
.cmd:hover{border-color:var(--caramel);color:var(--ink)}
.cmd b{font-weight:400;color:var(--caramel)}
.hero-editor{position:relative}
.hero-editor .editor{height:560px}
.hero-note{position:absolute;right:-6px;bottom:-78px;display:flex;align-items:flex-end;gap:6px;transform:rotate(-2deg)}
.hero-note svg{width:54px;height:54px;color:var(--caramel);margin-bottom:22px}
.sprinkles{position:absolute;inset:0;pointer-events:none;z-index:0}
.sprinkle{position:absolute;width:16px;height:5px;border-radius:3px;opacity:.5;display:block}
:root[data-bake="light"] .sprinkle{opacity:.7}
.drip{display:block;width:100%;height:64px;color:var(--page);background:var(--butter);margin-top:-1px}

/* flavors */
.flavors{background:var(--butter);color:var(--on-butter);padding-block:20px 110px}
.flavors .eyebrow{color:color-mix(in srgb,var(--on-butter) 70%,transparent)}
.flavors h2{font-size:clamp(40px,6vw,72px);margin-top:10px}
.flavors-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:24px;margin-bottom:34px}
.flavors-head p{max-width:46ch;margin:14px 0 0;color:color-mix(in srgb,var(--on-butter) 82%,transparent)}
.boxes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-bottom:28px}
.box{appearance:none;text-align:left;font:inherit;color:var(--ink);background:var(--tray);border:0;border-radius:16px;padding:20px 20px 18px;display:grid;gap:10px;cursor:pointer;
  box-shadow:0 0 0 1px rgba(0,0,0,.08);transition:transform .2s,box-shadow .2s}
.box:hover{transform:translateY(-2px)}
.box[aria-pressed="true"]{box-shadow:0 0 0 3px var(--caramel),0 18px 40px -24px rgba(0,0,0,.6)}
.box-dots{display:flex;gap:6px}.box-dots i{width:20px;height:20px;border-radius:50%;display:block}
.box-title{font-family:var(--display);font-size:26px;line-height:1.1}
.box-note{color:var(--ink-2);font-size:14.5px}
.box-names{display:flex;flex-wrap:wrap;gap:6px}
.box-names code{font-size:11.5px;color:var(--ink-3);border:1px solid var(--line);border-radius:6px;padding:2px 7px}
.stage{display:grid;gap:14px}
.stage-bar{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center}
.langs{display:flex;flex-wrap:wrap;gap:6px}
.langs button{appearance:none;border:1px solid color-mix(in srgb,var(--on-butter) 35%,transparent);background:transparent;color:var(--on-butter);font:500 14px var(--ui-font);padding:6px 14px;border-radius:999px;cursor:pointer}
.langs button[aria-selected="true"]{background:var(--on-butter);color:var(--butter);border-color:var(--on-butter)}
.flavors .bake{background:color-mix(in srgb,var(--tray) 85%,transparent);border-color:transparent}
.flavors .hand{color:var(--on-butter)}
.stage .editor{height:620px}
.stage .e-code{overflow:auto}

/* ingredients */
.ingredients{padding-block:110px 80px}
.ingredients h2{font-size:clamp(40px,6vw,72px);margin-top:10px}
.ingredients .lead{max-width:52ch;color:var(--ink-2);margin:16px 0 40px}
.shelf{display:grid;grid-template-columns:170px minmax(0,1fr);gap:24px;padding-block:22px;border-top:1px solid var(--line)}
.shelf h3{font-size:24px}
.jars{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:12px}
.jar{appearance:none;width:100%;text-align:left;background:transparent;border:0;color:var(--ink);font:inherit;padding:6px;border-radius:12px;display:grid;gap:3px;cursor:pointer}
.jar:hover{background:var(--tray)}
.swatch{width:56px;height:56px;border-radius:50%;display:block;margin-bottom:8px;box-shadow:inset 0 -5px 0 rgba(0,0,0,.15),0 0 0 1px var(--line)}
.jar-name{font-family:var(--display);font-size:16px;line-height:1.2;min-height:2.4em}
.jar-role{font-size:13px;color:var(--ink-3)}
.jar-hex{font-size:12.5px;color:var(--ink-2)}
.jar.copied .jar-hex::after{content:" · copied";color:var(--caramel)}

/* note + install */
.note{padding-block:40px 90px}
.note .wrap{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:56px}
.note h2{font-size:clamp(34px,4.6vw,54px)}
.letter{font-size:18px;color:var(--ink-2);max-width:58ch}
.letter p{margin:0 0 16px}
.letter .sign{font-family:var(--hand);font-size:30px;color:var(--caramel)}
.install{padding-block:70px 90px;border-top:1px solid var(--line)}
.install .wrap{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:56px;align-items:start}
.install h2{font-size:clamp(34px,4.6vw,54px)}
.steps{margin:0;padding:0;list-style:none;display:grid;gap:22px;counter-reset:step}
.steps li{display:grid;grid-template-columns:44px minmax(0,1fr);gap:14px}
.steps li::before{counter-increment:step;content:counter(step);font-family:var(--display);font-size:30px;color:var(--caramel);line-height:1}
.steps h3{font-size:22px;margin-bottom:6px}
.steps p{margin:0;color:var(--ink-2)}
kbd{font:12.5px var(--code-font);border:1px solid var(--line);border-bottom-width:2px;border-radius:5px;padding:1px 6px;background:var(--tray);color:var(--ink)}
.snippet{border-radius:12px;overflow:auto;border:1px solid var(--line);margin-top:12px}
.snippet .shiki{margin:0;padding:16px 18px;font:13.5px/1.6 var(--code-font)}
${["dark", "light"].map((t) => `:root[data-bake="${t}"] .snippet .shiki{background:var(--tray)!important}`).join("")}
footer{border-top:1px solid var(--line);padding-block:30px 46px;color:var(--ink-3);font-size:14.5px}
footer .wrap{display:flex;flex-wrap:wrap;gap:12px 28px;justify-content:space-between}
footer a{color:var(--ink-2)}

@media (max-width:980px){
  .hero .wrap,.note .wrap,.install .wrap{grid-template-columns:minmax(0,1fr)}
  .hero-note{display:none}
  .boxes{grid-template-columns:minmax(0,1fr)}
  .shelf{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:720px){
  .top nav a{display:none}
  .top nav{gap:12px}
  .cmd{white-space:normal;word-break:break-all;text-align:left;border-radius:14px}
  .btn,.cmd{width:100%;justify-content:center}
  .hero{padding-block:20px 70px}
  .hero-editor .editor,.stage .editor{height:460px}
  .editor .e-main{grid-template-columns:minmax(0,1fr)}
  .editor .e-activity,.editor .e-side{display:none}
  .e-status .r span:nth-child(-n+3){display:none}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
</style>
</head>
<body>
<header class="wrap top">
  <a class="brand" href="#"><img src="icon.png" alt="" width="34" height="34">Brownie</a>
  <nav>
    <a href="#flavors">Flavors</a>
    <a href="#ingredients">Ingredients</a>
    <a href="#install">Install</a>
    <a class="gh" href="https://github.com/gregadro/brownie-theme">GitHub</a>
    <div class="bake" role="group" aria-label="Bake">
      <button type="button" data-bake-set="dark" aria-pressed="true">Brownie</button>
      <button type="button" data-bake-set="light" aria-pressed="false">Blondie</button>
    </div>
  </nav>
</header>

<section class="hero">
  <div class="sprinkles" aria-hidden="true">${heroSprinkles}</div>
  <div class="wrap">
    <div>
      <div class="eyebrow">VS Code theme · v${esc(version)}</div>
      <h1>Brownie<span>with a pinch of salt</span></h1>
      <p>A warm, colorful theme for long evenings of code. Caramel keywords, burnt orange functions and a few sweet sprinkles, all on a calm milk chocolate tray.</p>
      <div class="actions">
        <a class="btn" href="https://marketplace.visualstudio.com/items?itemName=gregadro.brownie">Get it for VS Code</a>
        <button type="button" class="cmd" data-copy="code --install-extension gregadro.brownie"><b>$</b> code --install-extension gregadro.brownie</button>
      </div>
    </div>
    <div class="hero-editor">
      <div class="hero-code">${editorHTML({
        key: keyOf("salted-caramel", "dark"),
        fileName: codes.ts.file,
        codeHTML: codes.ts.html,
        lang: codes.ts.label,
        themeName: "Brownie",
        highlight: codes.ts.highlight,
      })}</div>
      <div class="hero-note" aria-hidden="true">
        <span class="hand">the brown butter bar,<br>baked in 2022</span>
        <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 10c22 2 40 14 40 40"/><path d="M38 42l10 9 8-11"/></svg>
      </div>
    </div>
  </div>
</section>

<svg class="drip" viewBox="0 0 1200 64" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="${dripPath(1200, 14)}"/></svg>

<section class="flavors" id="flavors">
  <div class="wrap">
    <div class="flavors-head">
      <div>
        <div class="eyebrow">Three flavors · two bakes</div>
        <h2>Pick a box</h2>
        <p>Every box has the same milk chocolate tray, cream text, caramel and burnt orange. Only the sprinkles change. Each one comes as a dark Brownie and a light Blondie.</p>
      </div>
      <div class="bake" role="group" aria-label="Bake">
        <button type="button" data-bake-set="dark" aria-pressed="true">Brownie</button>
        <button type="button" data-bake-set="light" aria-pressed="false">Blondie</button>
      </div>
    </div>
    <div class="boxes">${boxes}</div>
    <div class="stage">
      <div class="stage-bar"><div class="langs" role="tablist" aria-label="Language">${langTabs}</div><span class="hand">open any file, it all tastes the same</span></div>
      <div class="stage-code">${editors}</div>
    </div>
  </div>
</section>

<section class="ingredients" id="ingredients">
  <div class="wrap">
    <div class="eyebrow">Ingredients</div>
    <h2>What goes in</h2>
    <p class="lead">Every color has a name and a job. Click a jar to copy its hex. All syntax colors reach at least 4.5:1 contrast on the tray, and the build refuses colors that look too alike.</p>
    ${jarSets}
  </div>
</section>

<section class="note">
  <div class="wrap">
    <div><div class="eyebrow">From the kitchen</div><h2>Why a brownie</h2></div>
    <div class="letter">
      <p>I made Brownie in 2022 for my own Vue work. The idea was simple: writing code should feel as good as eating a salted caramel brownie. Warm, soft on the eyes, a little sweet, with a pinch of salt.</p>
      <p>This year it got a proper re-bake. The colors are clearer and easier to tell apart, there is a light Blondie for sunny days, and two new flavors if you like your brownie with berries or cherries.</p>
      <p>If it makes your editor a little cozier, that is all I wanted.</p>
      <p class="sign">Grega</p>
    </div>
  </div>
</section>

<section class="install" id="install">
  <div class="wrap">
    <div><div class="eyebrow">Install</div><h2>Into the oven</h2></div>
    <ol class="steps">
      <li><div><h3>Install the extension</h3><p>Search for <strong>Brownie</strong> in the Extensions view (<kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>X</kbd>), or get it from the <a href="https://marketplace.visualstudio.com/items?itemName=gregadro.brownie">Marketplace</a>.</p></div></li>
      <li><div><h3>Choose a flavor</h3><p>Open the theme picker with <kbd>Ctrl</kbd> <kbd>K</kbd> <kbd>Ctrl</kbd> <kbd>T</kbd> (<kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>T</kbd> on a Mac) and type <em>Brownie</em> or <em>Blondie</em>.</p></div></li>
      <li><div><h3>Let the sun decide</h3><p>Brownie at night, Blondie by day. Add this to your <code>settings.json</code>:</p><div class="snippet">${settingsHTML}</div></div></li>
    </ol>
  </div>
</section>

<footer><div class="wrap">
  <span>Baked by Grega Drofenik · MIT licence</span>
  <span><a href="https://github.com/gregadro/brownie-theme">Source on GitHub</a> · <a href="https://github.com/gregadro/brownie-theme/blob/main/CHANGELOG.md">Changelog</a> · <a href="https://www.buymeacoffee.com/gregadro">Buy me a coffee</a></span>
</div></footer>

<script>
(function () {
  var state = { flavor: "salted-caramel", bake: document.documentElement.dataset.bake || "dark", lang: "${langs[0]}" };
  var DEFAULT = "salted-caramel";
  function key(f, b) { return f + "-" + b; }
  function themeName(f, b, title) { var fam = b === "dark" ? "Brownie" : "Blondie"; return f === DEFAULT ? fam : fam + " " + title; }
  var titles = ${JSON.stringify(Object.fromEntries(flavors.map((f) => [f.id, f.title])))};

  function render() {
    var root = document.documentElement;
    root.dataset.bake = state.bake;
    document.querySelectorAll("[data-bake-set]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.bakeSet === state.bake)); });
    document.querySelectorAll(".hero-code .editor").forEach(function (e) {
      e.dataset.k = key(DEFAULT, state.bake);
      e.querySelector(".e-status .r span:last-child").textContent = themeName(DEFAULT, state.bake);
    });
    document.querySelectorAll(".stage-code .editor").forEach(function (e) {
      e.dataset.k = key(state.flavor, state.bake);
      e.querySelector(".e-status .r span:last-child").textContent = themeName(state.flavor, state.bake, titles[state.flavor]);
    });
    document.querySelectorAll(".snippet").forEach(function (e) { e.dataset.k = key(DEFAULT, state.bake); });
    document.querySelectorAll(".code-set").forEach(function (s) { s.hidden = s.dataset.lang !== state.lang; });
    document.querySelectorAll(".langs [data-lang]").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.lang === state.lang)); });
    document.querySelectorAll(".box").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.flavor === state.flavor));
      b.querySelectorAll(".box-dots i").forEach(function (i) { i.style.background = i.dataset[state.bake]; });
    });
    document.querySelectorAll(".jar-set").forEach(function (s) { s.hidden = !(s.dataset.flavor === state.flavor && s.dataset.bake === state.bake); });
  }

  document.querySelectorAll("[data-bake-set]").forEach(function (b) {
    b.addEventListener("click", function () { state.bake = b.dataset.bakeSet; try { localStorage.setItem("bake", state.bake); } catch (e) {} render(); });
  });
  document.querySelectorAll(".box").forEach(function (b) { b.addEventListener("click", function () { state.flavor = b.dataset.flavor; render(); }); });
  document.querySelectorAll(".langs [data-lang]").forEach(function (b) { b.addEventListener("click", function () { state.lang = b.dataset.lang; render(); }); });

  function copy(text, el, done) {
    var ok = function () { el.classList.add("copied"); if (done) done(); setTimeout(function () { el.classList.remove("copied"); }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, function () {});
  }
  document.querySelectorAll(".jar").forEach(function (j) { j.addEventListener("click", function () { copy(j.dataset.hex, j); }); });
  document.querySelectorAll("[data-copy]").forEach(function (c) {
    c.addEventListener("click", function () {
      var label = c.innerHTML;
      copy(c.dataset.copy, c, function () { c.textContent = "Copied. Paste it into your terminal."; setTimeout(function () { c.innerHTML = label; }, 1800); });
    });
  });
  render();
})();
</script>
</body>
</html>
`;
}
