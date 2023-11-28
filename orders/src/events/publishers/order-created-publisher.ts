import {Subjects,Publisher,OrderCreatedEvent} from '@macbease/tickets';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated=Subjects.OrderCreated;
}
