import { AbstractListener, OrderCompletedEvent, OrderStatus, Subject } from "@thegrinch.learning/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { environment } from "../../utils/environment";

export class OrderCompletedListener extends AbstractListener<OrderCompletedEvent> {
    readonly subject = Subject.OrderCompleted;
    queueGroupName = environment.nats.queueGroupName;

    async onMessage(data: OrderCompletedEvent['data'], message: Message): Promise<void> {
        const order = await Order.findById(data.id)
        
        if(order === null) {
            throw new Error('Order not found')
        }


        order.set({status: OrderStatus.Completed })

        await order.save()

        message.ack()
    }

}