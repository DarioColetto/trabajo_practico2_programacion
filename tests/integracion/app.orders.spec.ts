import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { makeApp } from '../../src/app';
import { OrdersMemoryRepo } from '../../src/repo/orders';

const app = makeApp();

beforeEach(() => OrdersMemoryRepo.clear());

describe('Orders HTTP', () => {
  it('POST /orders 201 with valid body; 422 when items empty', async () => {
    const bad = await request(app).post('/orders').send({ items: [], address: 'direccion' });
    expect(bad.status).toBe(422);

    const ok = await request(app).post('/orders').send({
      items: [{ size: 'S', toppings: ['olives'] }],
      address: 'Calle Muy Larga 123'
    });
    expect(ok.status).toBe(201);
    expect(ok.body).toHaveProperty('id');
  });

  it('POST /orders/:id/cancel returns 409 when delivered', async () => {
    const { body } = await request(app).post('/orders').send({
      items: [{ size: 'L', toppings: [] }],
      address: 'Av. Siempre Viva 742'
    });
    const id = body.id;

    // simular entregado
    await OrdersMemoryRepo.update(id, { status: 'delivered' });

    const resp = await request(app).post(`/orders/${id}/cancel`).send();
    expect(resp.status).toBe(409);
  });


  
});
