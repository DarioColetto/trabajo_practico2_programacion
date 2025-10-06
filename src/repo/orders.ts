import { Order } from '../domain/order.types';

const db = new Map<string, Order>();

export const OrdersMemoryRepo = {
  save(order: Order) { db.set(order.id, order); return order; },
  get(id: string) { return db.get(id) ?? null; },
  listByStatus(status?: Order['status']) {
    const all = Array.from(db.values());
    return status ? all.filter(o => o.status === status) : all;
  },
  update(id: string, patch: Partial<Order>) {
    const o = db.get(id); if (!o) return null;
    const updated = { ...o, ...patch };
    db.set(id, updated);
    return updated;
  },
  clear() { db.clear(); }
};
