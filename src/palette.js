// Single source of truth for Brownie colors.
//
// Every theme is one base (dark = Brownie, light = Blondie) plus one flavor.
// The base carries the identity: milk chocolate tray, whipped cream text, caramel
// keywords, burnt orange functions and the brown butter status bar.
// A flavor only adds the sweet colors on top.

const base = {
  dark: {
    // surfaces
    bg: "#261f1b", // editor, the milk chocolate baking tray
    bgSide: "#2a221e",
    bgChrome: "#332a24", // activity bar, title bar, tab strip
    bgWidget: "#2e2622", // hover, suggest, menus
    bgInput: "#1f1916",
    bgLine: "#2f2621", // current line
    border: "#55453a",
    selection: "#7a5b50",
    selectionSoft: "#3f322a",
    status: "#806a55", // brown butter
    statusFg: "#fff8f1",

    // text
    fg: "#fff8f1", // whipped cream
    fgMuted: "#c9b8a6",
    fgSubtle: "#937865",
    comment: "#918479",
    punctuation: "#a89a8e",

    // identity accents
    kw: "#d4a373", // salted caramel: keywords, tags, UI accent
    fn: "#ee750b", // burnt orange: functions
    prop: "#ad9073", // toffee: properties, attributes

    // status
    red: "#f07a6e",
    green: "#a9c47f",
    yellow: "#f0c060",
    blue: "#8fb4d8",
    magenta: "#e39ac0",
    cyan: "#8fd0c4",
  },

  light: {
    bg: "#fbf6ee", // vanilla sponge
    bgSide: "#f6eee3",
    bgChrome: "#ede2d3",
    bgWidget: "#fffaf4",
    bgInput: "#fffdf9",
    bgLine: "#f4ebdf",
    border: "#e0d2c0",
    selection: "#ead2b8",
    selectionSoft: "#f1e3d2",
    status: "#8a6a4a",
    statusFg: "#fff8f1",

    fg: "#3a2a20", // dark chocolate
    fgMuted: "#66513f",
    fgSubtle: "#8f7b69",
    comment: "#837160",
    punctuation: "#8c8178",

    kw: "#8a5d2c",
    fn: "#b84a00",
    prop: "#6f5f52",

    red: "#b8382b",
    green: "#4f7524",
    yellow: "#875f00",
    blue: "#3a6a8c",
    magenta: "#9a3f75",
    cyan: "#2f7a70",
  },
};

// Names shown in the docs. A role can have a different name in Blondie.
const names = {
  bg: { dark: "Baking Tray", light: "Vanilla Sponge" },
  fg: { dark: "Whipped Cream", light: "Dark Chocolate" },
  status: "Brown Butter",
  kw: "Salted Caramel",
  fn: "Burnt Orange",
  prop: "Toffee",
  comment: "Cocoa Dust",
  punctuation: "Powdered Sugar",
};

const flavors = [
  {
    id: "salted-caramel",
    title: "Salted Caramel",
    default: true,
    dark: { str: "#b3cf82", num: "#f0909b", type: "#f3c66f", param: "#ffd2ad", re: "#9fc4cc" },
    light: { str: "#486d27", num: "#b2405a", type: "#716a00", param: "#5f4537", re: "#2f6f7a" },
    names: {
      str: "Pistachio",
      num: "Raspberry",
      type: "Wildflower Honey",
      param: { dark: "Peach Cream", light: "Cocoa Nib" },
      re: "Sea Salt",
    },
  },
  {
    id: "berries-cream",
    title: "Berries & Cream",
    dark: { str: "#ffcf9e", num: "#b8a9f0", type: "#f4979c", param: "#d6bfe6", re: "#8fd6bb" },
    light: { str: "#a3533f", num: "#6450b0", type: "#b03c4c", param: "#8a52a0", re: "#1d7559" },
    names: {
      str: "Peach Cream",
      num: "Blueberry",
      type: "Strawberry",
      param: "Lavender Cream",
      re: "Mint Leaf",
    },
  },
  {
    id: "pistachio-cherry",
    title: "Pistachio & Cherry",
    dark: { str: "#a9d6a4", num: "#f27d7d", type: "#f4da82", param: "#f2bcc4", re: "#96b6ef" },
    light: { str: "#3c7638", num: "#bd3434", type: "#7a6800", param: "#a84874", re: "#3d62b0" },
    names: {
      str: "Pistachio Mint",
      num: "Black Cherry",
      type: "Lemon Custard",
      param: "Cherry Blossom",
      re: "Blueberry",
    },
  },
];

module.exports = { base, names, flavors };
