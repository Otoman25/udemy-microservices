import { Message } from "node-nats-streaming"
import { Subject, AbstractListener, TicketUpdatedEvent, NotFoundError } from "@thegrinch.learning/common"
import { Ticket } from "../../models/tickets"
import { environment } from "../../utils/environment"

export class TicketUpdatedListener extends AbstractListener<TicketUpdatedEvent> {
    readonly subject = Subject.TicketUpdated
    queueGroupName = environment.nats.queueGroupName

    async onMessage(data: TicketUpdatedEvent['data'], message: Message): Promise<void> {
        const {title, price} = data

        const ticket = await Ticket.checkEventSequential(data)

        if(ticket === null) {
            throw new Error('Ticket not found')
        }

        ticket.set({ title, price })
        await ticket.save()
        message.ack()
    }

}