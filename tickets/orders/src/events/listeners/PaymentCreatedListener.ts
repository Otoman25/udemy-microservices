import { AbstractListener, OrderStatus, PaymentCreatedEvent, Subject } from "@thegrinch.learning/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { natsWrapper } from "../../NatsWrapper";
import { environment } from "../../utils/environment";
import { OrderCompletedPublisher } from "../publishers/OrderCompletedPublisher";

export class PaymentCreatedListener extends AbstractListener<PaymentCreatedEvent> {
    readonly subject = Subject.PaymentCreated;
    queueGroupName: string = environment.nats.queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], message: Message): Promise<void> {
        const order = await Order.findById(data.orderId)

        if(order === null) {
            throw new Error('Order not found')
        } 

        order.set({status: OrderStatus.Completed})

        await order.save()

        message.ack()

        new OrderCompletedPublisher(natsWrapper.client).publish({
            id: order.id
        })
    }
    
}