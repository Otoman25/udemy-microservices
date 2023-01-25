import { AbstractListener, OrderCreatedEvent, OrderStatus, Subject } from "@thegrinch.learning/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { environment } from "../../utils/environment";

export class OrderCreatedListener extends AbstractListener<OrderCreatedEvent> {
    readonly subject = Subject.OrderCreated;
    queueGroupName = environment.nats.queueGroupName;
    async onMessage(data: { id: string; status: OrderStatus; userId: string; expiresAt: string; ticket: { id: string; price: number; }; version: number; }, message: Message): Promise<void> {
        const { id, ticket, status, userId, version } = data
        
        const order = Order.build({
            id,
            price: ticket.price,
            status,
            userId,
            version
        })

        await order.save()
        message.ack()
    }

}