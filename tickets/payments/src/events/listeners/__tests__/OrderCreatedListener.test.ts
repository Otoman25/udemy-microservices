import { OrderCreatedEvent, OrderStatus } from "@thegrinch.learning/common"
import mongoose from "mongoose"
import { Order } from "../../../models/orders"
import { natsWrapper } from "../../../NatsWrapper"
import { OrderCreatedListener } from "../OrderCreatedListener"

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'test',
        userId: 'test',
        status: OrderStatus.Created,
        ticket: {
            id: 'test',
            price: 10
        }
    }

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, data, message }

}

it('replicates the order info', async () => {
    const { listener, data, message } = await setup()

    await listener.onMessage(data, message)

    const order = await Order.findById(data.id)

    expect(order!.price).toEqual(data.ticket.price)
})

it('acknowledges the message', async () => {
    const { listener, data, message } = await setup()

    await listener.onMessage(data, message)
    expect(message.ack).toHaveBeenCalled()
})