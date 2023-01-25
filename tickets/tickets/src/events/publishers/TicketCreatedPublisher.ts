import { Publisher, Subject, TicketCreatedEvent } from "@thegrinch.learning/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated;
}