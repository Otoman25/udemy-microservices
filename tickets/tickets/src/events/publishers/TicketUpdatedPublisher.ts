import { Publisher, Subject, TicketUpdatedEvent } from "@thegrinch.learning/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subject.TicketUpdated;
} 