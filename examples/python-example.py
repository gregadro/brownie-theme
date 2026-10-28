"""Bakery inventory, a small Python example for the Brownie theme."""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from enum import Enum
from typing import Iterator

LOW_STOCK = 3
SKU_PATTERN = re.compile(r"^BRW-\d{4}$")


class Flavor(Enum):
    SALTED_CARAMEL = "salted caramel"
    WALNUT = "walnut"
    DOUBLE_CHOCOLATE = "double chocolate"


@dataclass(frozen=True)
class Brownie:
    sku: str
    flavor: Flavor
    price: float = 2.5
    tags: tuple[str, ...] = field(default_factory=tuple)

    def __post_init__(self) -> None:
        if not SKU_PATTERN.match(self.sku):
            raise ValueError(f"Invalid SKU: {self.sku!r}\n")


class Inventory:
    def __init__(self) -> None:
        self._stock: dict[str, int] = {}

    def add(self, brownie: Brownie, quantity: int = 1) -> Inventory:
        self._stock[brownie.sku] = self._stock.get(brownie.sku, 0) + quantity
        return self

    def low_stock(self) -> Iterator[str]:
        yield from (sku for sku, qty in self._stock.items() if qty <= LOW_STOCK)

    @property
    def total(self) -> int:
        return sum(self._stock.values())


if __name__ == "__main__":
    caramel = Brownie("BRW-0001", Flavor.SALTED_CARAMEL, tags=("bestseller",))
    walnut = Brownie("BRW-0002", Flavor.WALNUT, price=2.9)

    inventory = Inventory().add(caramel, 12).add(walnut, 2)
    # Only walnut is running low
    print(list(inventory.low_stock()), inventory.total, None, True)
