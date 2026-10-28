// HTML for the README images. Each page is screenshotted by render.mjs.

import { editorCSS, editorHTML } from "./editor.mjs";
import { FONTS_URL, PAGE, fontStacks, sprinkles, esc, nameFor } from "./shared.mjs";

const page = (body, css, cssThemes, width) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS_URL}">
<style>
:root{${fontStacks}}
${cssThemes}
${editorCSS}
*{box-sizing:border-box}
body{margin:0;background:transparent}
#shot{width:${width}px;position:relative;overflow:hidden;font-family:var(--ui-font)}
h1,h2,h3{font-family:var(--display);font-weight:400;margin:0;line-height:1.02}
.hand{font-family:var(--hand);font-weight:500}
.sprinkles{position:absolute;inset:0;pointer-events:none}
.sprinkle{position:absolute;width:18px;height:6px;border-radius:3px;opacity:.55;display:block}
${css}
</style></head><body><div id="shot">${body}</div></body></html>`;

export function heroImage({ codes, keyOf, cssThemes, flavors }) {
  const d = PAGE.dark;
  const colors = [...new Set(flavors.flatMap((f) => [f.dark.str, f.dark.num, f.dark.type, f.dark.re]))];
  const body = `<div class="hero">
    <div class="sprinkles">${sprinkles(colors, { count: 22, seed: 5, avoid: [[3, 14, 48, 92], [44, 3, 98, 97]] })}</div>
    <div class="copy">
      <img src="ICON" alt="" width="92" height="92">
      <h1>Brownie</h1>
      <p>A warm, colorful VS Code theme<br>with a pinch of salt.</p>
      <div class="tags"><span>3 flavors</span><span>Brownie &amp; Blondie</span><span>WCAG AA</span></div>
    </div>
    <div class="back">${editorHTML({ key: keyOf("salted-caramel", "light"), fileName: codes.vue.file, codeHTML: codes.vue.html, lang: codes.vue.label, themeName: "Blondie", compact: true })}</div>
    <div class="front">${editorHTML({ key: keyOf("salted-caramel", "dark"), fileName: codes.ts.file, codeHTML: codes.ts.html, lang: codes.ts.label, themeName: "Brownie", highlight: codes.ts.highlight })}</div>
  </div>`;
  const css = `
  .hero{height:820px;background:${d.page};color:${d.ink};position:relative}
  .copy{position:absolute;left:84px;top:170px;width:560px;z-index:2}
  .copy h1{font-size:116px;letter-spacing:-.02em;margin-top:18px}
  .copy p{font-size:26px;line-height:1.4;color:${d.ink2};margin:18px 0 0}
  .tags{display:flex;gap:10px;margin-top:34px}
  .tags span{font:14px var(--code-font);color:${d.caramel};border:1px solid ${d.line};border-radius:999px;padding:6px 14px}
  .back{position:absolute;left:880px;top:48px;width:620px;height:460px}
  .front{position:absolute;left:720px;top:200px;width:790px;height:570px;z-index:1}
  .back .editor,.front .editor{height:100%}`;
  return page(body, css, cssThemes, 1560);
}

export function flavorImage({ flavor, codes, keyOf, cssThemes }) {
  const d = PAGE.dark;
  const chips = ["str", "num", "type", "param", "re"]
    .map((r) => `<span><i style="background:${flavor.dark[r]}"></i>${esc(nameFor(flavor.names[r], "dark"))}</span>`)
    .join("");
  const darkName = flavor.default ? "Brownie" : `Brownie ${flavor.title}`;
  const lightName = flavor.default ? "Blondie" : `Blondie ${flavor.title}`;
  const body = `<div class="fl">
    <header><h2>${esc(flavor.title)}</h2><div class="chips">${chips}</div></header>
    <div class="pair">
      <figure>${editorHTML({ key: keyOf(flavor.id, "dark"), fileName: codes.ts.file, codeHTML: codes.ts.html, lang: codes.ts.label, themeName: darkName, highlight: codes.ts.highlight, compact: true })}<figcaption class="hand">${esc(darkName)}</figcaption></figure>
      <figure>${editorHTML({ key: keyOf(flavor.id, "light"), fileName: codes.vue.file, codeHTML: codes.vue.html, lang: codes.vue.label, themeName: lightName, compact: true })}<figcaption class="hand">${esc(lightName)}</figcaption></figure>
    </div>
  </div>`;
  const css = `
  .fl{background:${d.butter};color:${d.onButter};padding:54px 60px 40px}
  header{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:34px}
  h2{font-size:64px}
  .chips{display:flex;gap:18px;font-size:16px}
  .chips span{display:flex;align-items:center;gap:8px}
  .chips i{width:18px;height:18px;border-radius:50%;display:block;box-shadow:0 0 0 2px rgba(255,255,255,.25)}
  .pair{display:grid;grid-template-columns:1fr 1fr;gap:28px}
  figure{margin:0}
  figure .editor{height:560px}
  figcaption{font-size:30px;margin-top:12px;text-align:center}`;
  return page(body, css, cssThemes, 1560);
}

export function ingredientsImage({ variants, cssThemes }) {
  const d = PAGE.dark;
  const darkVariants = variants.filter((v) => v.type === "dark");
  const first = darkVariants[0];
  const base = ["bg", "fg", "kw", "fn", "prop", "status", "comment"]
    .map((r) => jar(first.p[r], nameFor(first.names[r], "dark"), r))
    .join("");
  const rows = darkVariants
    .map((v) => `<div class="row"><h3>${esc(v.flavor.title)}</h3><div class="jars">${["str", "num", "type", "param", "re"]
      .map((r) => jar(v.p[r], nameFor(v.flavor.names[r], "dark"), r))
      .join("")}</div></div>`)
    .join("");
  function jar(hex, name, role) {
    const labels = { bg: "background", fg: "text", kw: "keywords", fn: "functions", prop: "properties", status: "status bar", comment: "comments", str: "strings", num: "numbers", type: "types", param: "parameters", re: "regex" };
    return `<div class="jar"><i style="background:${hex}"></i><b>${esc(name)}</b><span>${labels[role]}</span><code>${hex}</code></div>`;
  }
  const body = `<div class="ing">
    <div class="row"><h3>Every box</h3><div class="jars">${base}</div></div>
    ${rows}
  </div>`;
  const css = `
  .ing{background:${d.page};color:${d.ink};padding:40px 60px 30px}
  .row{display:grid;grid-template-columns:260px 1fr;gap:20px;padding:26px 0;border-top:1px solid ${d.line}}
  .row:first-child{border-top:0}
  h3{font-size:30px;padding-top:12px}
  .jars{display:grid;grid-template-columns:repeat(7,1fr);gap:16px}
  .jar{display:grid;gap:2px}
  .jar i{width:60px;height:60px;border-radius:50%;display:block;margin-bottom:10px;box-shadow:inset 0 -6px 0 rgba(0,0,0,.16),0 0 0 1px ${d.line}}
  .jar b{font:400 17px var(--display);white-space:nowrap}
  .jar span{font-size:14px;color:${d.ink3}}
  .jar code{font:13px var(--code-font);color:${d.ink2}}`;
  return page(body, css, cssThemes, 1560);
}
