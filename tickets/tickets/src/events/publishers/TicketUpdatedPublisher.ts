import { AbstractPublisher, Subject, TicketUpdatedEvent } from "@thegrinch.learning/common"

export class TicketUpdatedPublisher extends AbstractPublisher<TicketUpdatedEvent> {
    readonly subject = Subject.TicketUpdated;
} 