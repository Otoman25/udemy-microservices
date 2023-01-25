import { AbstractListener, OrderCreatedEvent, OrderStatus, Subject } from "@thegrinch.learning/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../NatsWrapper";
import { environment } from "../../utils/environment";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";

export class OrderCreatedListener extends AbstractListener<OrderCreatedEvent> {
    readonly subject = Subject.OrderCreated
    queueGroupName = environment.nats.queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], message: Message): Promise<void> {
        const { id, ticket: ticketReference } = data
        const ticket = await Ticket.findById(ticketReference.id)

        if(ticket === null) {
            throw new Error('Ticket not found')
        }

        ticket.set({ orderId: id})
        await ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        })
        message.ack()
    }
    
}