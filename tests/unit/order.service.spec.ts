import { describe, it, expect, beforeEach } from 'vitest';
import { OrdersMemoryRepo } from '../../src/repo/orders';
import { OrderService } from '../../src/services/order.service';

beforeEach(() => OrdersMemoryRepo.clear());

describe('OrderService domain rules', () => {
  it('Calcula el total en base al tamanio y los toppings', () => {
    const o = OrderService.create({
      address: 'Calle Larga 1234',
      items: [{ size: 'M', toppings: ['a','b','c'] }]
    });
    expect(o.total).toBe(14.5)
  });

  it('Adress mayor a 10 caracteres', () => {
    const o = OrderService.create({
      address: 'Calle Larga 1234',
      items: [{ size: 'S', toppings: ['a'] }]
    });
    expect(o.address.length).toBeGreaterThan(10);
  });

  it('Error cuando se cancela un pedido enviado', () => {
    const o = OrderService.create({
      address: 'Direccion suficiente',
      items: [{ size: 'L', toppings: [] }]
    });
    OrdersMemoryRepo.update(o.id, { status: 'delivered' });
    expect(() => OrderService.cancel(o.id)).toThrow('CANNOT_CANCEL_DELIVERED');
  });
});
