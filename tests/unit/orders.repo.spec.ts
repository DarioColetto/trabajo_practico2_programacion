// tests/unit/orders.repo.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { OrdersMemoryRepo } from '../../src/repo/orders';
import type { Order } from '../../src/domain/order.types';

describe('OrdersMemoryRepo', () => {
  beforeEach(() => OrdersMemoryRepo.clear());

  it('listByStatus filtra correctamente', () => {
    
    const base: Omit<Order, 'id' | 'status'> = {
      items: [{ size: 'M', toppings: ['a'] }], 
      address: 'Direccion valida 123456',
      total: 10,
      createdAt: new Date().toISOString()
    };

    OrdersMemoryRepo.save({ id: '1', status: 'pending',   ...base });
    OrdersMemoryRepo.save({ id: '2', status: 'preparing', ...base });
    OrdersMemoryRepo.save({ id: '3', status: 'pending',   ...base });

    const onlyPending = OrdersMemoryRepo.listByStatus('pending');
    expect(onlyPending.map(o => o.id)).toEqual(['1', '3']);
  });

  it('update devuelve null si no existe', () => {
    const updated = OrdersMemoryRepo.update('nope', { status: 'canceled' });
    expect(updated).toBeNull();
  });
});
