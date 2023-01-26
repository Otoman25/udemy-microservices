import { AbstractPublisher, Subject, TicketCreatedEvent } from "@thegrinch.learning/common"

export class TicketCreatedPublisher extends AbstractPublisher<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated;
}