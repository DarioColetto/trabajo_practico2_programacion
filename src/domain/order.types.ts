export type Size = 'S' | 'M' | 'L';
export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'canceled';

export interface OrderItem {
  size: Size;
  toppings: string[]; // ≤ 5
}

export interface Order {
  id: string;
  items: OrderItem[];
  address: string; // min 10 chars
  status: OrderStatus;
  total: number; // calculado
  createdAt: string;
}
