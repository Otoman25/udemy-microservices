import { Subject } from "./Subjects";

export interface TicketCreatedEvent {
    subject: Subject.TicketCreated

    data: {
        id: string
        title: string
        price: number
    }
}

export interface TicketUpdatedEvent {
    subject: Subject.TicketCreated

    data: {
        id: string
        title: string
        price: number
    }
}