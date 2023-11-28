import {Subjects,Publisher,OrderCancelledEvent} from '@macbease/tickets';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled=Subjects.OrderCancelled;
}
