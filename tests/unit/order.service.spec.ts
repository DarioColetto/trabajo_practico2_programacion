import { describe, it, expect, beforeEach } from 'vitest';
import { OrdersMemoryRepo } from '../../src/repo/orders';
import { OrderService } from '../../src/services/order.service';

describe('OrderService - more branches', () => {
  beforeEach(() => OrdersMemoryRepo.clear());

  it('cancel devuelve null si el pedido no existe', () => {
    const res = OrderService.cancel('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    expect(res).toBeNull();
  });

  it('list devuelve todos y respeta el filtro', () => {
    const a = OrderService.create({
      items: [{ size: 'S', toppings: [] }],
      address: 'Direccion valida 12345'
    });
    const b = OrderService.create({
      items: [{ size: 'L', toppings: [] }],
      address: 'Direccion valida 67890'
    });
    OrdersMemoryRepo.update(b.id, { status: 'delivered' });

    const all = OrderService.list();
    const onlyDelivered = OrderService.list('delivered');

    expect(all.length).toBe(2);
    expect(onlyDelivered.length).toBe(1);
    expect(onlyDelivered[0].id).toBe(b.id);
  });
});
