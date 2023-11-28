import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@macbease/tickets';
import { Payment } from '../../models/payments';


it('returns a 404 when purchasing an order that does not exist',async()=>{
  await request(app)
  .post('/api/payments')
  .set('Cookie',global.signin())
  .send({
    token: "dsasas",
    orderId: new mongoose.Types.ObjectId().toHexString()
  })
  .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user',async()=>{
  const order=Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();
  await request(app)
  .post('/api/payments')
  .set('Cookie',global.signin())
  .send({
    token: 'asdfg',
    orderId: order.id
  })
  .expect(401);
});

it('returns a 400 when purchaing a cancelled order', async()=>{
  const userId= new mongoose.Types.ObjectId().toHexString();
  const order=Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });
  await order.save();
  await request(app)
  .post('/api/payments')
  .set('Cookie',global.signin(userId))
  .send({
    token: 'asdfg',
    orderId: order.id
  })
  .expect(400);
});

it('creates a payment record if everything checks out', async()=>{
  const userId= new mongoose.Types.ObjectId().toHexString();
  const order=Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();
  await request(app)
  .post('/api/payments')
  .set('Cookie',global.signin(userId))
  .send({
    token: 'asdfg',
    orderId: order.id
  })
  .expect(201);
  const payment=await Payment.findOne({orderId:order.id});
  expect(payment).not.toBeNull();
});
