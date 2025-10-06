const SIZE_BASE: Record<'S'|'M'|'L', number> = { S: 8, M: 10, L: 12 };
const TOPPING_PRICE = 1.5;

export function calcItemPrice(size: 'S'|'M'|'L', toppings: string[]): number {
  if (toppings.length > 5) throw new Error('MAX_TOPPINGS_EXCEEDED'); // regla
  return SIZE_BASE[size] + TOPPING_PRICE * toppings.length;
}

export function calcOrderTotal(items: {size:'S'|'M'|'L'; toppings:string[]}[]): number {
  return items.reduce((acc, it) => acc + calcItemPrice(it.size, it.toppings), 0);
}
