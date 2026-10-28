import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_TEMPERATURE = 180;
const fractionPattern = /(\d+)\s*\/\s*(\d+)/;

/**
 * Converts "1 1/2" style amounts to numbers.
 * @param {string} amount
 * @returns {number}
 */
export function parseAmount(amount) {
  const [whole, fraction = ""] = amount.trim().split(" ");
  const match = fraction.match(fractionPattern);
  return Number(whole) + (match ? Number(match[1]) / Number(match[2]) : 0);
}

class Recipe {
  #ingredients = new Map();
  static count = 0;

  constructor(name, { servings = 16, temperature = DEFAULT_TEMPERATURE } = {}) {
    this.name = name;
    this.servings = servings;
    this.temperature = temperature;
    Recipe.count++;
  }

  add(item, amount) {
    this.#ingredients.set(item, parseAmount(amount));
    return this;
  }

  scale(factor) {
    for (const [item, amount] of this.#ingredients) {
      this.#ingredients.set(item, amount * factor);
    }
    this.servings *= factor;
    return this;
  }

  get summary() {
    return `${this.name}: ${this.#ingredients.size} ingredients, ${this.servings} servings\n`;
  }
}

async function loadRecipe(file) {
  try {
    const raw = await readFile(path.join(import.meta.dirname, file), "utf8");
    const { name, ingredients } = JSON.parse(raw);
    const recipe = new Recipe(name);
    ingredients.forEach(({ item, amount }) => recipe.add(item, String(amount)));
    return recipe;
  } catch (error) {
    // Missing file? Bake from memory instead.
    console.warn(`Could not load ${file}:`, error?.message ?? error);
    return null;
  }
}

const brownies = (await loadRecipe("json-example.json")) ?? new Recipe("Brownies");
const isBig = brownies.servings > 12 && typeof brownies.name === "string";

brownies.add("butter", "1 1/2").scale(isBig ? 2 : 1);
console.log(brownies.summary, Recipe.count, undefined, NaN);

export default brownies;
