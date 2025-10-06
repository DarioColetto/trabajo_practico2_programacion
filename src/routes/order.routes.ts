import { Router } from 'express';
import { z } from 'zod';
import { OrderService } from '../services/order.service';

const sizeEnum = z.enum(['S','M','L']);
const orderItemSchema = z.object({
  size: sizeEnum,
  toppings: z.array(z.string()).max(5) // ≤5 toppings
});
const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1), // no vacío
  address: z.string().min(10)
});

export const ordersRouter = Router();

ordersRouter.post('/orders', (req, res) => {
  const parse = createOrderSchema.safeParse(req.body); // safeParse en bordes
  if (!parse.success) return res.status(422).json({ error: parse.error.flatten() }); // 422
  const order = OrderService.create(parse.data);
  res.status(201).json(order);
});

ordersRouter.get('/order/:id', (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params); // parse cuando errors=500
  const order = OrderService.get(id);
  if (!order) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json(order);
});

ordersRouter.post('/orders/:id/cancel', (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  try {
    const canceled = OrderService.cancel(id);
    if (!canceled) return res.status(404).json({ error: 'NOT_FOUND' });
    res.json(canceled);
  } catch (e:any) {
    if (e?.message === 'CANNOT_CANCEL_DELIVERED') {
      return res.status(409).json({ error: 'DELIVERED_CANNOT_BE_CANCELED' }); // 409
    }
    throw e;
  }
});

ordersRouter.get('/orders', (req, res) => {
  const q = z.object({ status: z.enum(['pending','preparing','delivered','canceled']).optional() })
              .safeParse(req.query);
  if (!q.success) return res.status(422).json({ error: q.error.flatten() });
  const list = OrderService.list(q.data.status);
  res.json(list);
});
