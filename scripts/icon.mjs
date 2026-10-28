// The Brownie icon: the letter B as a bitten brownie with sprinkles and a
// caramel drip, on a milk chocolate plate with a caramel ring ("night bake").
// Writes icon.svg (the source) and icon.png (what the Marketplace shows).
// Usage: npm run icon

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const C = {
  plate: "#261f1b", // milk chocolate, the dark theme background
  ring: "#d4a373", // salted caramel
  crust: "#a2704c",
  body: "#6a3f2a",
  caramel: "#f0a24e",
  caramelShade: "#b8692a",
  cream: "#fff8f1",
  sprinkles: ["#b3cf82", "#f0909b", "#f3c66f", "#9fc4cc"], // pistachio, raspberry, honey, sea salt
};

function iconSVG(size) {
  // B = stem + small upper bowl + bigger lower bowl
  const parts = `
    <rect x="158" y="112" width="92" height="292" rx="30"/>
    <rect x="158" y="112" width="176" height="150" rx="75"/>
    <rect x="158" y="240" width="214" height="164" rx="82"/>`;

  const sprinkle = ([x, y, r], i) =>
    `<rect x="${x - 17}" y="${y - 6}" width="34" height="12" rx="6" transform="rotate(${r} ${x} ${y})" fill="${C.sprinkles[i % C.sprinkles.length]}"/>`;
  const sprinkles = [
    [198, 150, 35], [262, 168, -28], [212, 222, 72], [300, 214, -60],
    [196, 372, 24], [338, 370, -34], [330, 336, 58], [220, 336, -8],
  ];

  const crumb = ([x, y, s, r]) =>
    `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="${s / 4}" transform="rotate(${r} ${x} ${y})" fill="${C.crust}"/>`;
  const crumbs = [[402, 96, 16, 20], [362, 62, 12, -15], [420, 146, 11, 40], [392, 196, 8, 10]];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <circle cx="256" cy="256" r="237" fill="${C.plate}" stroke="${C.ring}" stroke-width="18"/>
  <g fill="${C.crust}" stroke="${C.crust}" stroke-width="30" stroke-linejoin="round">${parts}</g>
  <g fill="${C.body}">${parts}</g>
  ${sprinkles.map(sprinkle).join("\n  ")}
  <defs><clipPath id="b-outer">
    <rect x="143" y="97" width="122" height="322" rx="45"/>
    <rect x="143" y="97" width="206" height="180" rx="90"/>
    <rect x="143" y="225" width="244" height="194" rx="97"/>
  </clipPath></defs>
  <g fill="${C.caramel}" clip-path="url(#b-outer)">
    <rect x="130" y="252" width="270" height="40"/>
    <rect x="178" y="270" width="26" height="58" rx="13"/>
    <rect x="322" y="270" width="24" height="46" rx="12"/>
    <rect x="352" y="270" width="22" height="34" rx="11"/>
  </g>
  <rect x="250" y="270" width="44" height="184" rx="22" fill="${C.caramel}"/>
  <rect x="276" y="300" width="11" height="138" rx="5.5" fill="${C.caramelShade}"/>
  <rect x="190" y="258" width="120" height="8" rx="4" fill="${C.cream}" opacity=".45"/>
  <g fill="${C.plate}">
    <circle cx="340" cy="110" r="42"/><circle cx="378" cy="152" r="34"/><circle cx="296" cy="90" r="30"/>
  </g>
  ${crumbs.map(crumb).join("\n  ")}
</svg>
`;
}

const svg = iconSVG(256);
fs.writeFileSync(path.join(root, "icon.svg"), svg);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 256, height: 256 } });
await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
await (await page.$("svg")).screenshot({ path: path.join(root, "icon.png"), omitBackground: true });
await browser.close();
console.log("✔ icon.svg, icon.png");
