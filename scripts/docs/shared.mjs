// Tokens and small building blocks shared by the landing page and the images.

export const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Young+Serif&family=Hanken+Grotesk:wght@400;500;600&family=JetBrains+Mono:ital,wght@0,400;0,600;1,400&family=Caveat:wght@500;600&display=swap";

// Page colors follow the theme itself: Brownie by default, Blondie in light mode.
export const PAGE = {
  dark: { page: "#1e1815", tray: "#261f1b", ink: "#fff8f1", ink2: "#c9b8a6", ink3: "#937865", line: "#3d322b", caramel: "#d4a373", orange: "#ee750b", butter: "#806a55", onButter: "#fff8f1" },
  light: { page: "#f5eee3", tray: "#fbf6ee", ink: "#3a2a20", ink2: "#66513f", ink3: "#8a7663", line: "#e2d4c2", caramel: "#8a5d2c", orange: "#b84a00", butter: "#8a6a4a", onButter: "#fff8f1" },
};

export const fontStacks = `
  --display:"Young Serif",Georgia,"Times New Roman",serif;
  --ui-font:"Hanken Grotesk","Segoe UI",system-ui,sans-serif;
  --code-font:"JetBrains Mono","Cascadia Code",Consolas,monospace;
  --hand:"Caveat","Segoe Print","Comic Sans MS",cursive;`;

// A caramel drip, like the one on the icon. Deterministic so builds are stable.
export function dripPath(width = 1200, band = 14) {
  const drips = [
    [70, 26, 46], [190, 18, 30], [330, 34, 58], [470, 16, 26], [560, 28, 44],
    [720, 20, 34], [840, 38, 62], [990, 18, 28], [1090, 26, 40],
  ];
  let d = `M0 0 H${width} V${band}`;
  for (const [x0, w, len] of [...drips].reverse()) {
    const x = (x0 / 1200) * width;
    const r = w / 2 - 3;
    d += ` L${x + w} ${band} C${x + w - 2} ${band} ${x + w - 3} ${band + 4} ${x + w - 3} ${band + 10}`;
    d += ` L${x + w - 3} ${len - r} A${r} ${r} 0 0 1 ${x + 3} ${len - r}`;
    d += ` L${x + 3} ${band + 10} C${x + 3} ${band + 4} ${x + 2} ${band} ${x} ${band}`;
  }
  return d + ` L0 ${band} Z`;
}

// Sprinkles from the icon, scattered with a seeded random so they stay put.
// `avoid` is a list of [left, top, right, bottom] boxes in percent to keep clear.
export function sprinkles(colors, { count = 26, seed = 7, avoid = [] } = {}) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const spots = [];
  while (spots.length < count) {
    const x = rnd() * 100, y = rnd() * 100;
    if (!avoid.some(([l, t, r, b]) => x > l && x < r && y > t && y < b)) spots.push([x, y]);
  }
  return spots.map(([x, y], i) => {
    const rot = Math.round(rnd() * 180);
    const color = colors[i % colors.length];
    return `<i class="sprinkle" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;transform:rotate(${rot}deg);background:${color}"></i>`;
  }).join("");
}

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Resolves a palette name that may differ between Brownie and Blondie.
export const nameFor = (entry, type) => (typeof entry === "string" ? entry : entry[type]);
