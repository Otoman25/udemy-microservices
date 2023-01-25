import { AbstractListener, OrderCancelledEvent, OrderStatus, Subject } from "@thegrinch.learning/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { environment } from "../../utils/environment";

export class OrderCancelledListener extends AbstractListener<OrderCancelledEvent> {
    readonly subject = Subject.OrderCancelled;
    queueGroupName = environment.nats.queueGroupName;
    async onMessage(data: OrderCancelledEvent['data'], message: Message): Promise<void> {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version -1,
        })

        if(order === null) {
            throw new Error('Order not found')
        }

        order.set({
            status: OrderStatus.Cancelled
        })

        await order.save()

        message.ack()
    }

}