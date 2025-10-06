import { randomUUID } from 'node:crypto';
import { calcOrderTotal } from '../domain/pricing';
import { OrdersMemoryRepo } from '../repo/orders.memory';
import { Order, OrderItem } from '../domain/order.types';

export const OrderService = {
  create(input: {items: OrderItem[]; address: string}): Order {
    // reglas de dominio (no sólo validación de entrada):
    // - calcular total
    // - estado inicial
    const total = calcOrderTotal(input.items);
    const order: Order = {
      id: randomUUID(),
      items: input.items,
      address: input.address,
      status: 'pending',
      total,
      createdAt: new Date().toISOString()
    };
    return OrdersMemoryRepo.save(order);
  },

  get(id: string): Order | null {
    return OrdersMemoryRepo.get(id);
  },

  //getAll

  cancel(id: string): Order | null {
    const found = OrdersMemoryRepo.get(id);
    if (!found) return null;
    if (found.status === 'delivered') {
      // no se puede cancelar si delivered
      // devolveremos control al controlador para 409
      throw new Error('CANNOT_CANCEL_DELIVERED');
    }
    return OrdersMemoryRepo.update(id, { status: 'canceled' }); // No borra, solo actualiza estado.
  },

  list(status?: Order['status']) {
    return OrdersMemoryRepo.listByStatus(status);
  }
};