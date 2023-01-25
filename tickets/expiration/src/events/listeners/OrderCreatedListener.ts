import { AbstractListener, OrderCreatedEvent, OrderStatus, Subject } from "@thegrinch.learning/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/ExpirationQueue";
import { environment } from "../../utils/environment";

export class OrderCreatedListener extends AbstractListener<OrderCreatedEvent> {
    readonly subject = Subject.OrderCreated;
    queueGroupName = environment.nats.queueGroupName;

    onMessage(data: OrderCreatedEvent['data'], message: Message): void {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

        
        expirationQueue.add({ orderId: data.id }, { delay })

        message.ack()
    }

}