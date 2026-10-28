// Small color helpers shared by the build and the docs renderer.

const hexRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

// WCAG 2 contrast ratio
function contrast(c1, c2) {
  const lum = (hex) => {
    const [r, g, b] = hexRgb(hex).map(linear);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [lum(c1), lum(c2)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function oklab(hex) {
  const [r, g, b] = hexRgb(hex).map(linear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

// Perceptual difference in OKLab, scaled ×100 (≈ 2 is barely visible).
function deltaE(c1, c2) {
  const [p, q] = [oklab(c1), oklab(c2)];
  return 100 * Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

module.exports = { contrast, deltaE };
