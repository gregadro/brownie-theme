// Renders the landing page (docs/index.html) and the README images
// (docs/images/*.png) from the generated themes and the files in examples/.
// Usage: npm run docs   (runs the theme build first)
// Set PREVIEW_DIR to also save full-page screenshots of the landing page.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHighlighter } from "shiki";
import { chromium } from "playwright";
import { themeVars, shikiSelector } from "./editor.mjs";
import { buildSite } from "./site.mjs";
import { heroImage, flavorImage, ingredientsImage } from "./images.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);
const { base, names, flavors } = require(path.join(root, "src/palette.js"));
const { version } = require(path.join(root, "package.json"));

const keyOf = (flavorId, type) => `${flavorId}-${type}`;
const variants = flavors.flatMap((flavor) =>
  ["dark", "light"].map((type) => {
    const family = type === "dark" ? "Brownie" : "Blondie";
    const file = `${family.toLowerCase()}${flavor.default ? "" : "-" + flavor.id}.json`;
    const theme = JSON.parse(fs.readFileSync(path.join(root, "themes", file), "utf8"));
    return { flavor, type, names, key: keyOf(flavor.id, type), theme, p: { ...base[type], ...flavor[type] } };
  })
);

// What the editor windows show. `lines` trims a file for the fixed-size images.
const SOURCES = {
  ts: { src: "typescript-example.ts", lang: "typescript", file: "oven.ts", label: "TypeScript", lines: [5, 30], highlight: 19 },
  vue: { src: "vuejs-example.vue", lang: "vue", file: "Recipe.vue", label: "Vue", lines: [1, 26] },
  css: { src: "brownie.css", lang: "css", file: "brownie.css", label: "CSS", lines: [1, 26] },
  py: { src: "python-example.py", lang: "python", file: "bakery.py", label: "Python", lines: [1, 26] },
  json: { src: "json-example.json", lang: "json", file: "recipe.json", label: "JSON", lines: [1, 24] },
  md: { src: "markdown-example.md", lang: "markdown", file: "README.md", label: "Markdown", lines: [1, 26] },
};

const highlighter = await createHighlighter({
  themes: variants.map((v) => v.theme),
  langs: [...new Set(Object.values(SOURCES).map((s) => s.lang)), "jsonc"],
});
const allThemes = Object.fromEntries(variants.map((v) => [v.key, v.theme.name]));
const highlight = (code, lang) =>
  highlighter.codeToHtml(code, { lang, themes: allThemes, defaultColor: false });

const read = (file) => fs.readFileSync(path.join(root, "examples", file), "utf8").replace(/\r\n/g, "\n").trimEnd();
const codes = {}; // full files for the landing page
const snippets = {}; // trimmed for images
for (const [id, s] of Object.entries(SOURCES)) {
  const text = read(s.src);
  const [from, to] = s.lines;
  codes[id] = { ...s, html: highlight(text, s.lang), highlight: s.highlight ? s.highlight + from - 1 : 0 };
  snippets[id] = { ...s, html: highlight(text.split("\n").slice(from - 1, to).join("\n"), s.lang), highlight: s.highlight || 0 };
}

const cssThemes = variants.map((v) => themeVars(v.key, v.theme) + "\n" + shikiSelector(v.key)).join("\n");
const settingsHTML = highlight(
  `{
  "window.autoDetectColorScheme": true,
  "workbench.preferredDarkColorTheme": "Brownie",
  "workbench.preferredLightColorTheme": "Blondie"
}`,
  "jsonc"
);

// landing page
const docs = path.join(root, "docs");
const images = path.join(docs, "images");
fs.mkdirSync(images, { recursive: true });
fs.writeFileSync(path.join(docs, "index.html"), buildSite({ variants, codes, keyOf, cssThemes, settingsHTML, version }));
fs.copyFileSync(path.join(root, "icon.png"), path.join(docs, "icon.png"));
console.log("✔ docs/index.html");

// images
const icon = "data:image/png;base64," + fs.readFileSync(path.join(root, "icon.png")).toString("base64");
const shots = [
  ["hero.png", heroImage({ codes: snippets, keyOf, cssThemes, flavors })],
  ...flavors.map((f) => [`flavor-${f.id}.png`, flavorImage({ flavor: f, codes: snippets, keyOf, cssThemes })]),
  ["ingredients.png", ingredientsImage({ variants, cssThemes })],
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1600, height: 1000 } });
for (const [file, html] of shots) {
  await page.setContent(html.replace(/ICON/g, icon), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await (await page.$("#shot")).screenshot({ path: path.join(images, file) });
  console.log(`✔ docs/images/${file}`);
}

if (process.env.PREVIEW_DIR) {
  const url = pathToFileURL(path.join(docs, "index.html")).href;
  for (const [name, width, bake] of [["desktop-dark", 1440, "dark"], ["desktop-light", 1440, "light"], ["phone", 390, "dark"]]) {
    const p = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: bake });
    await p.goto(url, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(process.env.PREVIEW_DIR, `site-${name}.png`), fullPage: true });
    await p.close();
  }
  console.log(`✔ previews in ${process.env.PREVIEW_DIR}`);
}
await browser.close();
