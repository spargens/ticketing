import { ExpirationCompleteEvent, Publisher, Subjects } from "@macbease/tickets";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete=Subjects.ExpirationComplete;
}