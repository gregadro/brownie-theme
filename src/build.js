// Generates themes/*.json from src/palette.js and checks that every color
// is readable and that syntax colors can be told apart.
// Usage: node src/build.js

const fs = require("fs");
const path = require("path");
const { base, flavors } = require("./palette");
const { contrast, deltaE } = require("./color");

// Brownie (dark) and Blondie (light) for every flavor.
// The default flavor keeps the plain names, so existing users stay on it.
const VARIANTS = flavors.flatMap((flavor) =>
  ["dark", "light"].map((type) => {
    const family = type === "dark" ? "Brownie" : "Blondie";
    return {
      flavor,
      type,
      name: flavor.default ? family : `${family} ${flavor.title}`,
      file: `${family.toLowerCase()}${flavor.default ? "" : "-" + flavor.id}.json`,
      p: { ...base[type], ...flavor[type] },
    };
  })
);

// Appends an alpha channel (0–1) to a #rrggbb color.
const a = (hex, alpha) =>
  hex +
  Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");

function colors(p, type) {
  const dark = type === "dark";
  const onAccent = dark ? p.bg : p.bgWidget;

  return {
    // base
    foreground: p.fgMuted,
    descriptionForeground: p.fgSubtle,
    disabledForeground: a(p.fgSubtle, 0.6),
    errorForeground: p.red,
    focusBorder: a(p.kw, 0.7),
    "icon.foreground": p.fgMuted,
    "selection.background": a(p.kw, 0.35),
    "widget.shadow": dark ? "#00000059" : "#5a3a2026",
    "widget.border": p.border,
    "sash.hoverBorder": p.kw,
    "textLink.foreground": p.fn,
    "textLink.activeForeground": p.kw,
    "textBlockQuote.background": p.bgChrome,
    "textBlockQuote.border": p.kw,
    "textCodeBlock.background": p.bgChrome,
    "textPreformat.foreground": p.kw,
    "textSeparator.foreground": p.border,
    "progressBar.background": p.fn,

    // title bar & command center
    "titleBar.activeBackground": p.bgChrome,
    "titleBar.activeForeground": p.kw,
    "titleBar.inactiveBackground": p.bgChrome,
    "titleBar.inactiveForeground": p.fgSubtle,
    "titleBar.border": p.border,
    "commandCenter.background": p.bgSide,
    "commandCenter.foreground": p.fgMuted,
    "commandCenter.border": p.border,
    "commandCenter.activeBackground": p.bgWidget,
    "commandCenter.activeBorder": a(p.kw, 0.5),

    // menus
    "menu.background": p.bgWidget,
    "menu.foreground": p.fg,
    "menu.selectionBackground": p.selection,
    "menu.selectionForeground": p.fg,
    "menu.separatorBackground": p.border,
    "menu.border": p.border,
    "menubar.selectionBackground": p.selectionSoft,

    // activity bar
    "activityBar.background": p.bgChrome,
    "activityBar.foreground": p.kw,
    "activityBar.inactiveForeground": p.fgSubtle,
    "activityBar.activeBorder": p.kw,
    "activityBar.border": p.border,
    "activityBarBadge.background": p.fn,
    "activityBarBadge.foreground": onAccent,

    // side bar
    "sideBar.background": p.bgSide,
    "sideBar.foreground": p.fgMuted,
    "sideBar.border": p.border,
    "sideBarTitle.foreground": p.kw,
    "sideBarSectionHeader.background": p.bgSide,
    "sideBarSectionHeader.foreground": p.kw,
    "sideBarSectionHeader.border": p.border,
    "sideBarStickyScroll.background": p.bgSide,

    // lists & trees
    "list.activeSelectionBackground": p.selection,
    "list.activeSelectionForeground": p.fg,
    "list.activeSelectionIconForeground": p.fg,
    "list.inactiveSelectionBackground": p.selectionSoft,
    "list.inactiveSelectionForeground": p.fg,
    "list.hoverBackground": a(p.selectionSoft, 0.6),
    "list.hoverForeground": p.fg,
    "list.focusOutline": a(p.kw, 0.6),
    "list.highlightForeground": p.fn,
    "list.focusHighlightForeground": p.type,
    "list.errorForeground": p.red,
    "list.warningForeground": p.yellow,
    "list.filterMatchBackground": a(p.fn, 0.25),
    "listFilterWidget.background": p.bgWidget,
    "listFilterWidget.outline": p.kw,
    "listFilterWidget.noMatchesOutline": p.red,
    "tree.indentGuidesStroke": p.border,

    // editor groups & tabs
    "editorGroup.border": p.border,
    "editorGroupHeader.tabsBackground": p.bgChrome,
    "editorGroupHeader.tabsBorder": p.border,
    "editorGroupHeader.noTabsBackground": p.bg,
    "editorGroup.dropBackground": a(p.kw, 0.15),
    "tab.activeBackground": p.bg,
    "tab.activeForeground": p.fg,
    "tab.activeBorderTop": p.kw,
    "tab.activeBorder": p.bg,
    "tab.inactiveBackground": p.bgChrome,
    "tab.inactiveForeground": p.fgSubtle,
    "tab.unfocusedActiveForeground": p.fgMuted,
    "tab.unfocusedActiveBorderTop": a(p.kw, 0.4),
    "tab.hoverBackground": p.bgLine,
    "tab.border": p.border,
    "tab.activeModifiedBorder": p.fn,
    "tab.inactiveModifiedBorder": a(p.fn, 0.5),
    "breadcrumb.background": p.bg,
    "breadcrumb.foreground": p.fgSubtle,
    "breadcrumb.focusForeground": p.fg,
    "breadcrumb.activeSelectionForeground": p.kw,
    "breadcrumbPicker.background": p.bgWidget,

    // editor
    "editor.background": p.bg,
    "editor.foreground": p.fg,
    "editorCursor.foreground": p.fn,
    "editor.lineHighlightBackground": p.bgLine,
    "editor.lineHighlightBorder": p.bgLine,
    "editor.selectionBackground": a(p.selection, dark ? 0.75 : 0.9),
    "editor.inactiveSelectionBackground": a(p.selection, 0.4),
    "editor.selectionHighlightBackground": a(p.kw, 0.18),
    "editor.wordHighlightBackground": a(p.kw, 0.16),
    "editor.wordHighlightStrongBackground": a(p.fn, 0.22),
    "editor.findMatchBackground": a(p.fn, 0.45),
    "editor.findMatchBorder": p.fn,
    "editor.findMatchHighlightBackground": a(p.fn, 0.2),
    "editor.findRangeHighlightBackground": a(p.kw, 0.1),
    "editor.rangeHighlightBackground": a(p.kw, 0.1),
    "editor.hoverHighlightBackground": a(p.kw, 0.15),
    "editor.foldBackground": a(p.kw, 0.08),
    "editorLink.activeForeground": p.fn,
    "editorLineNumber.foreground": p.fgSubtle,
    "editorLineNumber.activeForeground": p.kw,
    "editorIndentGuide.background1": a(p.border, 0.9),
    "editorIndentGuide.activeBackground1": a(p.kw, 0.5),
    "editorWhitespace.foreground": a(p.fgSubtle, 0.35),
    "editorRuler.foreground": p.border,
    "editorCodeLens.foreground": p.fgSubtle,
    "editorInlayHint.foreground": p.fgSubtle,
    "editorInlayHint.background": a(p.bgChrome, 0.8),
    "editorGhostText.foreground": a(p.fgSubtle, 0.8),
    "editorBracketMatch.background": a(p.kw, 0.18),
    "editorBracketMatch.border": a(p.kw, 0.6),
    "editorUnnecessaryCode.opacity": "#000000a0",
    "editorStickyScroll.background": p.bg,
    "editorStickyScroll.shadow": dark ? "#00000066" : "#5a3a2026",
    "editorStickyScrollHover.background": p.bgLine,

    // bracket pair colorization: one sprinkle of every flavor color
    "editorBracketHighlight.foreground1": p.kw,
    "editorBracketHighlight.foreground2": p.num,
    "editorBracketHighlight.foreground3": p.type,
    "editorBracketHighlight.foreground4": p.re,
    "editorBracketHighlight.foreground5": p.str,
    "editorBracketHighlight.foreground6": p.param,
    "editorBracketHighlight.unexpectedBracket.foreground": p.red,
    "editorBracketPairGuide.activeBackground1": a(p.kw, 0.5),
    "editorBracketPairGuide.activeBackground2": a(p.num, 0.5),
    "editorBracketPairGuide.activeBackground3": a(p.type, 0.5),
    "editorBracketPairGuide.activeBackground4": a(p.re, 0.5),
    "editorBracketPairGuide.activeBackground5": a(p.str, 0.5),
    "editorBracketPairGuide.activeBackground6": a(p.param, 0.5),

    // diagnostics
    "editorError.foreground": p.red,
    "editorWarning.foreground": p.yellow,
    "editorInfo.foreground": p.blue,
    "editorHint.foreground": p.green,
    "problemsErrorIcon.foreground": p.red,
    "problemsWarningIcon.foreground": p.yellow,
    "problemsInfoIcon.foreground": p.blue,

    // gutter
    "editorGutter.background": p.bg,
    "editorGutter.addedBackground": p.green,
    "editorGutter.modifiedBackground": p.yellow,
    "editorGutter.deletedBackground": p.red,
    "editorGutter.foldingControlForeground": p.fgSubtle,

    // overview ruler & minimap
    "editorOverviewRuler.border": p.border,
    "editorOverviewRuler.findMatchForeground": a(p.fn, 0.6),
    "editorOverviewRuler.selectionHighlightForeground": a(p.kw, 0.5),
    "editorOverviewRuler.errorForeground": p.red,
    "editorOverviewRuler.warningForeground": p.yellow,
    "editorOverviewRuler.infoForeground": p.blue,
    "editorOverviewRuler.addedForeground": a(p.green, 0.7),
    "editorOverviewRuler.modifiedForeground": a(p.yellow, 0.7),
    "editorOverviewRuler.deletedForeground": a(p.red, 0.7),
    "minimap.findMatchHighlight": a(p.fn, 0.7),
    "minimap.selectionHighlight": a(p.kw, 0.6),
    "minimap.errorHighlight": p.red,
    "minimap.warningHighlight": p.yellow,
    "minimapGutter.addedBackground": p.green,
    "minimapGutter.modifiedBackground": p.yellow,
    "minimapGutter.deletedBackground": p.red,

    // scrollbar
    "scrollbar.shadow": "#00000000",
    "scrollbarSlider.background": a(p.fgSubtle, 0.2),
    "scrollbarSlider.hoverBackground": a(p.fgSubtle, 0.35),
    "scrollbarSlider.activeBackground": a(p.kw, 0.45),

    // widgets (find, hover, suggest)
    "editorWidget.background": p.bgWidget,
    "editorWidget.foreground": p.fg,
    "editorWidget.border": p.border,
    "editorWidget.resizeBorder": p.kw,
    "editorHoverWidget.background": p.bgWidget,
    "editorHoverWidget.border": p.border,
    "editorHoverWidget.statusBarBackground": p.bgChrome,
    "editorSuggestWidget.background": p.bgWidget,
    "editorSuggestWidget.border": p.border,
    "editorSuggestWidget.foreground": p.fg,
    "editorSuggestWidget.selectedBackground": p.selection,
    "editorSuggestWidget.selectedForeground": p.fg,
    "editorSuggestWidget.highlightForeground": p.fn,
    "editorSuggestWidget.focusHighlightForeground": p.type,
    "editorSuggestWidgetStatus.foreground": p.fgSubtle,

    // peek view
    "peekView.border": p.kw,
    "peekViewTitle.background": p.bgChrome,
    "peekViewTitleLabel.foreground": p.fg,
    "peekViewTitleDescription.foreground": p.fgSubtle,
    "peekViewEditor.background": p.bgSide,
    "peekViewEditorGutter.background": p.bgSide,
    "peekViewEditor.matchHighlightBackground": a(p.fn, 0.3),
    "peekViewResult.background": p.bgChrome,
    "peekViewResult.fileForeground": p.fg,
    "peekViewResult.lineForeground": p.fgMuted,
    "peekViewResult.matchHighlightBackground": a(p.fn, 0.3),
    "peekViewResult.selectionBackground": p.selection,
    "peekViewResult.selectionForeground": p.fg,

    // diff & merge
    "diffEditor.insertedTextBackground": a(p.green, 0.18),
    "diffEditor.removedTextBackground": a(p.red, 0.18),
    "diffEditor.insertedLineBackground": a(p.green, 0.1),
    "diffEditor.removedLineBackground": a(p.red, 0.1),
    "diffEditor.diagonalFill": a(p.border, 0.8),
    "diffEditorGutter.insertedLineBackground": a(p.green, 0.2),
    "diffEditorGutter.removedLineBackground": a(p.red, 0.2),
    "merge.currentHeaderBackground": a(p.green, 0.4),
    "merge.currentContentBackground": a(p.green, 0.15),
    "merge.incomingHeaderBackground": a(p.blue, 0.4),
    "merge.incomingContentBackground": a(p.blue, 0.15),
    "merge.commonHeaderBackground": a(p.fgSubtle, 0.4),
    "merge.commonContentBackground": a(p.fgSubtle, 0.15),

    // inputs, dropdowns, buttons, badges
    "input.background": p.bgInput,
    "input.foreground": p.fg,
    "input.border": p.border,
    "input.placeholderForeground": p.fgSubtle,
    "inputOption.activeBackground": a(p.kw, 0.3),
    "inputOption.activeBorder": p.kw,
    "inputOption.activeForeground": p.fg,
    "inputValidation.errorBackground": p.bgWidget,
    "inputValidation.errorBorder": p.red,
    "inputValidation.errorForeground": p.fg,
    "inputValidation.warningBackground": p.bgWidget,
    "inputValidation.warningBorder": p.yellow,
    "inputValidation.infoBackground": p.bgWidget,
    "inputValidation.infoBorder": p.blue,
    "dropdown.background": p.bgInput,
    "dropdown.foreground": p.fg,
    "dropdown.border": p.border,
    "dropdown.listBackground": p.bgWidget,
    "checkbox.background": p.bgInput,
    "checkbox.border": p.border,
    "checkbox.foreground": p.kw,
    "button.background": p.kw,
    "button.foreground": onAccent,
    "button.hoverBackground": p.fn,
    "button.border": "#00000000",
    "button.separator": a(onAccent, 0.4),
    "button.secondaryBackground": p.bgChrome,
    "button.secondaryForeground": p.fg,
    "button.secondaryHoverBackground": p.selectionSoft,
    "badge.background": p.kw,
    "badge.foreground": onAccent,
    "keybindingLabel.background": p.bgChrome,
    "keybindingLabel.foreground": p.fg,
    "keybindingLabel.border": p.border,
    "keybindingLabel.bottomBorder": p.border,

    // quick input / command palette
    "quickInput.background": p.bgWidget,
    "quickInput.foreground": p.fg,
    "quickInputTitle.background": p.bgChrome,
    "quickInputList.focusBackground": p.selection,
    "quickInputList.focusForeground": p.fg,
    "pickerGroup.foreground": p.kw,
    "pickerGroup.border": p.border,

    // panel & terminal
    "panel.background": p.bgSide,
    "panel.border": p.border,
    "panelTitle.activeForeground": p.fg,
    "panelTitle.activeBorder": p.kw,
    "panelTitle.inactiveForeground": p.fgSubtle,
    "panelSection.border": p.border,
    "panelInput.border": p.border,
    "terminal.background": p.bgSide,
    "terminal.foreground": p.fg,
    "terminal.selectionBackground": a(p.selection, 0.8),
    "terminalCursor.foreground": p.fn,
    "terminal.border": p.border,
    ...terminal(p, type),

    // status bar: the brown butter band
    "statusBar.background": p.status,
    "statusBar.foreground": p.statusFg,
    "statusBar.border": p.status,
    "statusBar.noFolderBackground": p.status,
    "statusBar.noFolderForeground": p.statusFg,
    "statusBar.debuggingBackground": p.fn,
    "statusBar.debuggingForeground": dark ? p.bg : p.statusFg,
    "statusBar.debuggingBorder": p.fn,
    "statusBarItem.hoverBackground": "#ffffff1f",
    "statusBarItem.activeBackground": "#ffffff2e",
    "statusBarItem.remoteBackground": p.kw,
    "statusBarItem.remoteForeground": onAccent,
    "statusBarItem.errorBackground": p.red,
    "statusBarItem.errorForeground": onAccent,
    "statusBarItem.warningBackground": p.yellow,
    "statusBarItem.warningForeground": onAccent,
    "statusBarItem.prominentBackground": "#0000002e",

    // notifications
    "notifications.background": p.bgWidget,
    "notifications.foreground": p.fg,
    "notifications.border": p.border,
    "notificationCenterHeader.background": p.bgChrome,
    "notificationToast.border": p.border,
    "notificationLink.foreground": p.fn,
    "notificationsErrorIcon.foreground": p.red,
    "notificationsWarningIcon.foreground": p.yellow,
    "notificationsInfoIcon.foreground": p.blue,

    // git decorations
    "gitDecoration.addedResourceForeground": p.green,
    "gitDecoration.modifiedResourceForeground": p.yellow,
    "gitDecoration.deletedResourceForeground": p.red,
    "gitDecoration.renamedResourceForeground": p.cyan,
    "gitDecoration.untrackedResourceForeground": p.green,
    "gitDecoration.ignoredResourceForeground": a(p.fgSubtle, 0.7),
    "gitDecoration.conflictingResourceForeground": p.magenta,
    "gitDecoration.stageModifiedResourceForeground": p.yellow,
    "gitDecoration.stageDeletedResourceForeground": p.red,

    // misc
    "settings.headerForeground": p.kw,
    "settings.modifiedItemIndicator": p.fn,
    "welcomePage.tileBackground": p.bgWidget,
    "walkThrough.embeddedEditorBackground": p.bgSide,
    "debugToolBar.background": p.bgWidget,
    "editor.stackFrameHighlightBackground": a(p.yellow, 0.18),
    "editor.focusedStackFrameHighlightBackground": a(p.green, 0.18),
    "debugIcon.breakpointForeground": p.red,
    "charts.foreground": p.fg,
    "charts.lines": p.fgSubtle,
    "charts.red": p.red,
    "charts.blue": p.blue,
    "charts.yellow": p.yellow,
    "charts.orange": p.fn,
    "charts.green": p.green,
    "charts.purple": p.magenta,
  };
}

function terminal(p, type) {
  const dark = type === "dark";
  const ansi = {
    Black: dark ? p.bgChrome : p.fg,
    Red: p.red,
    Green: p.green,
    Yellow: p.yellow,
    Blue: p.blue,
    Magenta: p.magenta,
    Cyan: p.cyan,
    White: dark ? p.fgMuted : p.fgSubtle,
    BrightBlack: p.fgSubtle,
    BrightRed: p.num,
    BrightGreen: p.str,
    BrightYellow: p.type,
    BrightBlue: p.re,
    BrightMagenta: p.param,
    BrightCyan: p.re,
    BrightWhite: dark ? p.fg : p.fgMuted,
  };
  return Object.fromEntries(
    Object.entries(ansi).map(([k, v]) => [`terminal.ansi${k}`, v])
  );
}

const rule = (name, scope, foreground, fontStyle) => ({
  name,
  scope,
  settings: { ...(foreground && { foreground }), ...(fontStyle !== undefined && { fontStyle }) },
});

function tokenColors(p) {
  const jsonKeys = [p.fn, p.kw, p.type, p.num, p.param, p.re];
  const jsonDict = " meta.structure.dictionary.value.json meta.structure.dictionary.json";

  return [
    rule("Comment", ["comment", "punctuation.definition.comment"], p.comment, "italic"),
    rule("Comment doc tags", ["comment storage.type", "comment entity.name.type", "comment keyword"], p.fgMuted, "italic"),
    rule("Invalid", ["invalid", "invalid.illegal"], p.red),
    rule("Deprecated", ["invalid.deprecated"], p.fgSubtle, "strikethrough"),

    rule("Punctuation", ["punctuation", "meta.brace", "keyword.operator", "punctuation.separator", "punctuation.terminator"], p.punctuation),
    rule("Variable", ["variable", "variable.other", "meta.definition.variable"], p.fg),
    rule("Property", ["variable.other.property", "variable.other.object.property", "meta.object-literal.key", "support.variable.property", "entity.name.tag.yaml", "entity.name.tag.toml"], p.prop),
    rule("Parameter", ["variable.parameter", "meta.parameters variable"], p.param, "italic"),
    rule("Language variable", ["variable.language", "variable.language.this", "variable.language.super"], p.num, "italic"),

    rule("Keyword, Storage", ["keyword", "keyword.control", "storage", "storage.type", "storage.modifier", "keyword.operator.new", "keyword.operator.expression", "keyword.operator.logical.python", "keyword.operator.word"], p.kw),
    rule("Arrow, Assignment operators", ["storage.type.function.arrow", "keyword.operator.assignment", "keyword.operator.type.annotation"], p.punctuation),

    rule("Function", ["entity.name.function", "meta.function-call entity.name.function", "variable.function", "support.function", "keyword.other.special-method"], p.fn),
    rule("Class, Type", ["entity.name.type", "entity.name.class", "entity.other.inherited-class", "support.class", "support.type", "entity.name.namespace", "entity.name.module", "storage.type.java", "storage.type.cs"], p.type),
    rule("Builtin type", ["support.type.primitive", "support.type.builtin", "keyword.type"], p.type, "italic"),

    rule("String", ["string", "string.quoted", "string.template", "punctuation.definition.string"], p.str),
    rule("Template expression", ["punctuation.definition.template-expression", "punctuation.section.embedded"], p.kw),
    rule("Template expression content", ["meta.template.expression"], p.fg),
    rule("Regular expression", ["string.regexp"], p.re),
    rule("Escape, Placeholder", ["constant.character.escape", "constant.other.placeholder", "string constant.other.placeholder"], p.re),

    rule("Number, Constant", ["constant", "constant.numeric", "constant.language", "constant.character", "support.constant", "variable.other.enummember"], p.num),
    rule("Unit", ["keyword.other.unit"], p.num),

    // HTML, XML, JSX, Vue
    rule("Tag", ["entity.name.tag", "meta.tag.sgml"], p.kw),
    rule("Component tag", ["support.class.component", "entity.name.tag.component"], p.type),
    rule("Tag punctuation", ["punctuation.definition.tag"], p.punctuation),
    rule("Attribute", ["entity.other.attribute-name"], p.prop, "italic"),
    rule("Vue directive", ["entity.other.attribute-name.html.vue", "punctuation.attribute-shorthand"], p.fn, "italic"),
    rule("Decorator", ["meta.decorator", "entity.name.function.decorator", "punctuation.decorator"], p.type, "italic"),

    // CSS, SCSS, Less
    rule("CSS property", ["support.type.property-name.css", "support.type.property-name.scss", "support.type.property-name.less", "support.type.vendored.property-name"], p.prop),
    rule("CSS value", ["support.constant.property-value", "support.constant.font-name", "support.constant.color"], p.fg),
    rule("CSS class", ["entity.other.attribute-name.class.css", "entity.other.attribute-name.class"], p.type, ""),
    rule("CSS id", ["entity.other.attribute-name.id"], p.fn, ""),
    rule("CSS pseudo", ["entity.other.attribute-name.pseudo-class", "entity.other.attribute-name.pseudo-element"], p.re, ""),
    rule("CSS variable", ["variable.css", "variable.argument.css", "variable.scss", "variable.other.less"], p.param),
    rule("CSS at-rule", ["keyword.control.at-rule", "punctuation.definition.keyword.css"], p.kw),
    rule("Hex color", ["constant.other.color"], p.num),

    // JSON keys get a different flavor on every nesting level
    ...jsonKeys.map((color, level) =>
      rule(
        `JSON key level ${level}`,
        ["source.json meta.structure.dictionary.json" + jsonDict.repeat(level) + " support.type.property-name.json"],
        color
      )
    ),
    rule("JSON key punctuation", ["support.type.property-name.json punctuation"], p.punctuation),

    // Markdown & markup
    rule("Markup heading", ["markup.heading", "markup.heading entity.name", "entity.name.section.markdown"], p.fn, "bold"),
    rule("Markup heading punctuation", ["punctuation.definition.heading.markdown"], p.kw),
    rule("Markup bold", ["markup.bold"], p.type, "bold"),
    rule("Markup italic", ["markup.italic"], p.param, "italic"),
    rule("Markup bold italic", ["markup.bold markup.italic", "markup.italic markup.bold"], p.type, "bold italic"),
    rule("Markup strikethrough", ["markup.strikethrough"], undefined, "strikethrough"),
    rule("Markup underline", ["markup.underline"], undefined, "underline"),
    rule("Markup inline code", ["markup.inline.raw", "markup.raw"], p.str),
    rule("Markup code fence", ["punctuation.definition.markdown", "punctuation.definition.raw.markdown", "fenced_code.block.language"], p.fgSubtle),
    rule("Markup fenced code", ["markup.fenced_code.block.markdown"], p.fg),
    rule("Markup quote", ["markup.quote"], p.fgMuted, "italic"),
    rule("Markup list bullet", ["punctuation.definition.list.begin.markdown", "beginning.punctuation.definition.list.markdown"], p.kw),
    rule("Markup link text", ["string.other.link.title.markdown", "string.other.link.description.markdown"], p.fn),
    rule("Markup link url", ["markup.underline.link", "constant.other.reference.link.markdown"], p.re),
    rule("Markup separator", ["meta.separator"], p.fgSubtle, "bold"),
    rule("Markup table", ["markup.table"], p.fg),

    // diff
    rule("Diff inserted", ["markup.inserted"], p.green),
    rule("Diff deleted", ["markup.deleted"], p.red),
    rule("Diff changed", ["markup.changed"], p.yellow),
    rule("Diff header", ["meta.diff.header", "meta.diff.range"], p.re),
  ];
}

function semanticTokenColors(p) {
  return {
    variable: p.fg,
    "variable.readonly": p.fg,
    "variable.defaultLibrary": p.type,
    "variable.constant": p.num,
    parameter: { foreground: p.param, italic: true },
    property: p.prop,
    "property.readonly": p.prop,
    enumMember: p.num,
    function: p.fn,
    method: p.fn,
    "function.defaultLibrary": p.fn,
    class: p.type,
    interface: { foreground: p.type, italic: true },
    type: p.type,
    typeParameter: { foreground: p.type, italic: true },
    enum: p.type,
    namespace: p.type,
    decorator: { foreground: p.type, italic: true },
    keyword: p.kw,
    selfKeyword: { foreground: p.num, italic: true },
    "*.deprecated": { strikethrough: true },
  };
}

// Readability: minimum WCAG contrast of each role against the surfaces code
// and UI text sit on.
const MIN_CONTRAST = { fg: 4.5, fgMuted: 4.5, fgSubtle: 3, comment: 3.6, punctuation: 3, kw: 4.5, fn: 4.5, prop: 4.5, type: 4.5, str: 4.5, num: 4.5, param: 4.5, re: 4.5, red: 4.5, green: 4.5, yellow: 4.5, blue: 4.5 };
// Distinctness: syntax colors must not blur into each other (OKLab ΔE × 100).
// Light colors have less room to move, so the bar is a little lower there.
const SYNTAX = ["fg", "kw", "fn", "prop", "type", "str", "num", "param", "re"];
const MIN_DELTA_E = { dark: 6, light: 5 };

function check({ name, type, p }) {
  const failures = [];
  for (const [role, min] of Object.entries(MIN_CONTRAST)) {
    for (const surface of ["bg", "bgSide", "bgWidget"]) {
      const ratio = contrast(p[role], p[surface]);
      if (ratio < min) failures.push(`${name}: ${role} on ${surface} = ${ratio.toFixed(2)} (min ${min})`);
    }
  }
  const status = contrast(p.statusFg, p.status);
  if (status < 4.5) failures.push(`${name}: status bar text = ${status.toFixed(2)} (min 4.5)`);
  for (let i = 0; i < SYNTAX.length; i++) {
    for (let j = i + 1; j < SYNTAX.length; j++) {
      const d = deltaE(p[SYNTAX[i]], p[SYNTAX[j]]);
      if (d < MIN_DELTA_E[type]) failures.push(`${name}: ${SYNTAX[i]} and ${SYNTAX[j]} look alike (ΔE ${d.toFixed(1)}, min ${MIN_DELTA_E[type]})`);
    }
  }
  return failures;
}

const outDir = path.join(__dirname, "..", "themes");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir);

const failures = [];
for (const variant of VARIANTS) {
  const { file, name, type, p } = variant;
  const theme = {
    $schema: "vscode://schemas/color-theme",
    name,
    type,
    semanticHighlighting: true,
    colors: colors(p, type),
    tokenColors: tokenColors(p),
    semanticTokenColors: semanticTokenColors(p),
  };
  fs.writeFileSync(path.join(outDir, file), JSON.stringify(theme, null, 2) + "\n");
  console.log(`✔ themes/${file}  (${name})`);
  failures.push(...check(variant));
}

if (failures.length) {
  console.error("\nColor check failed:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log("✔ contrast and distinctness checks passed");
