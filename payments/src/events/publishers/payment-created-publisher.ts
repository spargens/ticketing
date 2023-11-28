import { PaymentCreatedEvent, Publisher, Subjects } from "@macbease/tickets";

export class PaymentsCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  subject: Subjects.PaymentCreated=Subjects.PaymentCreated;
}