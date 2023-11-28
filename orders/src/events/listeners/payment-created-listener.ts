import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@macbease/tickets";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { Message } from "node-nats-streaming";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
  subject: Subjects.PaymentCreated=Subjects.PaymentCreated;
  queueGroupName=queueGroupName;

 async onMessage(data:PaymentCreatedEvent['data'], msg: Message) {
    const order=await Order.findById(data.orderId);
    if(!order){
      throw new Error('Order not found');
    }
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
    msg.ack();
  }

}