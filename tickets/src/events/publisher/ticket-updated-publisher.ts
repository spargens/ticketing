import {Publisher,Subjects,TicketUpdatedEvent} from '@macbease/tickets';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated=Subjects.TicketUpdated;
}
