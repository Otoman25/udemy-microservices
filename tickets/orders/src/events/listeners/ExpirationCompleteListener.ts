import { Message } from "node-nats-streaming"
import { Subject, AbstractListener, ExpirationCompleteEvent, OrderStatus } from "@thegrinch.learning/common"
import { environment } from "../../utils/environment"
import { Order } from "../../models/orders"
import { OrderCancelledPublisher } from "../publishers/OrderCancelledPublisher"
import { natsWrapper } from "../../NatsWrapper"

export class ExpirationCompleteListener extends AbstractListener<ExpirationCompleteEvent> {
    readonly subject = Subject.ExpirationComplete
    queueGroupName = environment.nats.queueGroupName

    async onMessage(data: ExpirationCompleteEvent['data'], message: Message): Promise<void> {
        const order = await Order.findById(data.orderId).populate('ticket')

        if(order === null) {
            throw new Error('Order not found')
        }

        if(order.status === OrderStatus.Completed) {
            message.ack()
            throw new Error('Order has been completed')
        }

        order.set({
            status: OrderStatus.Cancelled
        })

        await order.save()

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        message.ack()
    }

}