// A small, faithful VS Code window drawn with HTML. Colors come straight from
// the generated theme JSON, so the docs can never drift from the theme.

const ICONS = {
  files: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
  git: '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="9" r="2.2"/><path d="M6 8.2v7.6M18 11.2c0 3.5-6 2.5-10.5 5.6"/>',
  run: '<path d="M8 5v14l11-7z"/>',
  ext: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><path d="m14.5 4.5 5 5M19.5 4.5l-5 5"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// CSS custom properties for one theme, scoped to [data-k="key"].
export function themeVars(key, theme) {
  const c = theme.colors;
  const vars = {
    "e-bg": c["editor.background"],
    "e-fg": c["editor.foreground"],
    "e-chrome": c["titleBar.activeBackground"],
    "e-title-fg": c["titleBar.activeForeground"],
    "e-side": c["sideBar.background"],
    "e-side-fg": c["sideBar.foreground"],
    "e-side-head": c["sideBarSectionHeader.foreground"],
    "e-sel": c["list.activeSelectionBackground"],
    "e-border": c["editorGroup.border"],
    "e-act": c["activityBar.foreground"],
    "e-act-off": c["activityBar.inactiveForeground"],
    "e-tab-off": c["tab.inactiveForeground"],
    "e-tab-line": c["tab.activeBorderTop"],
    "e-line": c["editor.lineHighlightBackground"],
    "e-num": c["editorLineNumber.foreground"],
    "e-num-on": c["editorLineNumber.activeForeground"],
    "e-status": c["statusBar.background"],
    "e-status-fg": c["statusBar.foreground"],
    "e-mod": c["gitDecoration.modifiedResourceForeground"],
    "e-new": c["gitDecoration.untrackedResourceForeground"],
    "e-badge": c["activityBarBadge.background"],
    "e-badge-fg": c["activityBarBadge.foreground"],
    "e-guide": c["editorIndentGuide.background1"],
  };
  return `[data-k="${key}"]{${Object.entries(vars).map(([k, v]) => `--${k}:${v}`).join(";")}}`;
}

// Tells shiki-rendered spans which theme variable to read.
export function shikiSelector(key) {
  return `[data-k="${key}"] .shiki span{color:var(--shiki-${key});font-style:var(--shiki-${key}-font-style);font-weight:var(--shiki-${key}-font-weight)}`;
}

export const editorCSS = `
.editor{background:var(--e-bg);color:var(--e-fg);border-radius:12px;overflow:hidden;display:grid;grid-template-rows:auto minmax(0,1fr) auto;
  box-shadow:0 1px 0 rgba(255,255,255,.04) inset,0 40px 80px -40px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.35);font-family:var(--ui-font)}
.e-title{background:var(--e-chrome);color:var(--e-title-fg);height:36px;display:flex;align-items:center;padding:0 14px;font-size:12.5px;border-bottom:1px solid var(--e-border);position:relative}
.e-dots{display:flex;gap:7px}.e-dots i{width:11px;height:11px;border-radius:50%;background:var(--e-border);display:block}
.e-name{position:absolute;left:50%;transform:translateX(-50%);opacity:.9;white-space:nowrap}
.e-main{display:grid;grid-template-columns:48px 210px minmax(0,1fr);min-height:0}
.e-activity{background:var(--e-chrome);color:var(--e-act-off);display:flex;flex-direction:column;align-items:center;gap:20px;padding-top:14px;border-right:1px solid var(--e-border)}
.e-activity span{position:relative;display:grid;place-items:center;width:48px}
.e-activity span.on{color:var(--e-act);box-shadow:inset 2px 0 0 var(--e-act)}
.e-activity b{position:absolute;right:9px;bottom:-4px;background:var(--e-badge);color:var(--e-badge-fg);font:600 9px/14px var(--ui-font);min-width:14px;height:14px;border-radius:7px;text-align:center}
.e-side{background:var(--e-side);color:var(--e-side-fg);font-size:12.5px;border-right:1px solid var(--e-border);padding:10px 0;overflow:hidden}
.e-side h6{margin:0 0 8px;padding:0 16px;font:600 11px var(--ui-font);letter-spacing:.06em;color:var(--e-side-head)}
.e-side ul{list-style:none;margin:0;padding:0}
.e-side li{display:flex;justify-content:space-between;gap:8px;padding:3px 16px 3px 26px;white-space:nowrap}
.e-side li.dir{padding-left:16px}
.e-side li.on{background:var(--e-sel);color:var(--e-fg)}
.e-side li .m{color:var(--e-mod)}.e-side li .u{color:var(--e-new)}
.e-side li.m-file{color:var(--e-mod)}.e-side li.u-file{color:var(--e-new)}
.e-pane{display:grid;grid-template-rows:auto minmax(0,1fr);min-width:0}
.e-tabs{background:var(--e-chrome);display:flex;border-bottom:1px solid var(--e-border);overflow:hidden}
.e-tabs span{padding:9px 18px;font-size:12.5px;color:var(--e-tab-off);border-right:1px solid var(--e-border);white-space:nowrap}
.e-tabs span.on{background:var(--e-bg);color:var(--e-fg);box-shadow:inset 0 2px 0 var(--e-tab-line);margin-bottom:-1px}
.e-code{overflow:hidden;min-width:0}
.e-code .shiki{margin:0;padding:12px 0 16px;background:transparent!important;font:13.5px/1.65 var(--code-font);counter-reset:ln;tab-size:2;overflow:hidden}
.e-code .shiki code{display:block}
.e-code .line{display:inline-block;width:100%;padding-right:16px}
.e-code .line::before{counter-increment:ln;content:counter(ln);display:inline-block;width:3.2em;padding-right:1.4em;text-align:right;color:var(--e-num)}
.e-code .line.hl{background:var(--e-line)}
.e-code .line.hl::before{color:var(--e-num-on)}
.e-status{background:var(--e-status);color:var(--e-status-fg);font-size:12px;display:flex;gap:18px;padding:4px 14px;white-space:nowrap;overflow:hidden}
.e-status .r{margin-left:auto;display:flex;gap:18px}
.editor.compact .e-main{grid-template-columns:48px minmax(0,1fr)}
.editor.compact .e-side{display:none}
`;

const FILE_TREE = [
  ["dir", "src"],
  ["", "oven.ts", "m"],
  ["", "Recipe.vue", ""],
  ["", "brownie.css", "u"],
  ["", "recipe.json", ""],
  ["", "bakery.py", ""],
  ["dir", "docs"],
  ["", "README.md", "m"],
];

export function editorHTML({ key, fileName, codeHTML, lang, themeName, highlight = 0, compact = false, branch = "main" }) {
  const tree = FILE_TREE.map(([kind, name, mark]) => {
    if (kind === "dir") return `<li class="dir">⌄ ${name}</li>`;
    const on = name === fileName ? " on" : "";
    const cls = mark ? ` ${mark}-file` : "";
    return `<li class="${(on + cls).trim()}"><span>${name}</span>${mark ? `<span class="${mark}">${mark === "m" ? "M" : "U"}</span>` : ""}</li>`;
  }).join("");
  const code = highlight
    ? codeHTML.replace(new RegExp(`((?:<span class="line">[\\s\\S]*?</span>\\n){${highlight - 1}})<span class="line">`), '$1<span class="line hl">')
    : codeHTML;
  return `<div class="editor${compact ? " compact" : ""}" data-k="${key}">
  <div class="e-title"><span class="e-dots"><i></i><i></i><i></i></span><span class="e-name">${fileName} — bakery</span></div>
  <div class="e-main">
    <div class="e-activity"><span class="on">${icon("files")}</span><span>${icon("search")}</span><span>${icon("git")}<b>2</b></span><span>${icon("run")}</span><span>${icon("ext")}</span></div>
    <div class="e-side"><h6>EXPLORER</h6><ul>${tree}</ul></div>
    <div class="e-pane">
      <div class="e-tabs"><span class="on">${fileName}</span><span>recipe.json</span></div>
      <div class="e-code">${code}</div>
    </div>
  </div>
  <div class="e-status"><span>⎇ ${branch}</span><span>⊘ 0 ⚠ 0</span><span class="r"><span>Ln ${highlight || 1}, Col 1</span><span>Spaces: 2</span><span>UTF-8</span><span>${lang}</span><span>${themeName}</span></span></div>
</div>`;
}
