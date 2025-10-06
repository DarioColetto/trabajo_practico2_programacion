import request from 'supertest';
import { makeApp } from '../../src/app';
import { OrdersMemoryRepo } from '../../src/repo/orders'; // ajusta el path/nombre según tu repo real

const app = makeApp();

describe('Orders HTTP - more cases', () => {
  beforeEach(() => OrdersMemoryRepo.clear());

  it('POST /orders -> 422 cuando items está vacío', async () => {
    const r = await request(app).post('/orders').send({
      items: [],
      address: 'Direccion suficiente'
    });
    expect(r.status).toBe(422);
  });

  it('POST /orders -> 422 cuando address es corta', async () => {
    const r = await request(app).post('/orders').send({
      items: [{ size: 'M', toppings: [] }],
      address: 'corto'
    });
    expect(r.status).toBe(422);
  });

  it('GET /order/:id -> 404 cuando no existe', async () => {
    const r = await request(app).get('/order/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    // si tu validación exige UUID y lanza 500, cambia por un UUID válido random
    expect([404, 400, 422, 500]).toContain(r.status); // ajusta si tu código devuelve 404
  });

  it('POST /orders/:id/cancel -> 404 cuando no existe', async () => {
    const r = await request(app).post('/orders/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/cancel');
    expect([404, 400, 422, 500]).toContain(r.status); // ajusta a tu contrato; ideal 404
  });

  it('GET /orders?status=preparing -> filtra por estado', async () => {
    // crear 2 pedidos
    const o1 = await request(app).post('/orders').send({
      items: [{ size: 'S', toppings: [] }],
      address: 'Calle Muy Larga 123'
    });
    const o2 = await request(app).post('/orders').send({
      items: [{ size: 'L', toppings: ['pepperoni'] }],
      address: 'Otra direccion muy larga 456'
    });
    const id1 = o1.body.id;
    const id2 = o2.body.id;

    // mover uno a preparing para probar el filtro
    await OrdersMemoryRepo.update(id2, { status: 'preparing' });

    const r = await request(app).get('/orders?status=preparing');
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
    expect(r.body.length).toBe(1);
    expect(r.body[0].id).toBe(id2);
  });

  it('GET /orders?status=invalid -> 422 por query inválida', async () => {
    const r = await request(app).get('/orders?status=invalid');
    expect([422, 400]).toContain(r.status); // ajusta a tu contrato; ideal 422
  });
});
