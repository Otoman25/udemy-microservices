import { Message } from "node-nats-streaming"
import { Subject, AbstractListener, TicketCreatedEvent } from "@thegrinch.learning/common"
import { Ticket } from "../../models/tickets"
import { environment } from "../../utils/environment"

export class TicketCreatedListener extends AbstractListener<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated
    queueGroupName = environment.nats.queueGroupName

    async onMessage(data: TicketCreatedEvent['data'], message: Message): Promise<void> {
        const {title, price, id} = data
        const ticket = Ticket.build({ id, title, price })
        await ticket.save()
        message.ack()
    }

}