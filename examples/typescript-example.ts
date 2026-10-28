/**
 * A tiny bakery queue.
 * @see https://github.com/gregadro/brownie-theme
 */
export enum Topping {
  SaltedCaramel = "salted-caramel",
  Walnut = "walnut",
  None = "none",
}

export interface Brownie {
  readonly id: number;
  topping: Topping;
  bakedAt?: Date;
}

const MAX_TRAY_SIZE = 16;
const slugPattern = /^[a-z]+(-[a-z]+)*$/g;

export class Oven<T extends Brownie = Brownie> {
  private tray: T[] = [];

  constructor(private readonly temperature: number = 180) {}

  add(item: T): this {
    if (this.tray.length >= MAX_TRAY_SIZE) {
      throw new Error(`Tray is full (${MAX_TRAY_SIZE} pieces)\n`);
    }
    this.tray.push(item);
    return this;
  }

  async bake(minutes = 25): Promise<T[]> {
    await new Promise((resolve) => setTimeout(resolve, minutes * 1000));
    const now = new Date();
    return this.tray.map((b) => ({ ...b, bakedAt: now }));
  }
}

const oven = new Oven(175);
const isSlug = slugPattern.test(Topping.SaltedCaramel);

oven
  .add({ id: 1, topping: Topping.SaltedCaramel })
  .add({ id: 2, topping: isSlug ? Topping.Walnut : Topping.None })
  .bake()
  .then((tray) => console.log(tray.length, "brownies ready", true, null));
