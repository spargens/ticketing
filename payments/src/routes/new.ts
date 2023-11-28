import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@macbease/tickets';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { Payment } from '../models/payments';
import mongoose from 'mongoose';
import { PaymentsCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router=express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
  ],
validateRequest,
  async(req:Request,res:Response)=>{
    const {token,orderId}=req.body;
    const order=await Order.findById(orderId);
    if(!order){
      throw new NotFoundError();
    }
    if(order.userId!==req.currentUser!.id){
      throw new NotAuthorizedError();
    }
    if(order.status===OrderStatus.Cancelled){
      throw new BadRequestError('Cannot pay for an cancelled order');
    }
    //payment goes here
    const payment=Payment.build({
      orderId,
      stripeId: 'payment_id'
    });
    await payment.save();
    new PaymentsCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    });

    res.status(201).send({id: payment.id});
  }
);

export {router as createChargeRouter};