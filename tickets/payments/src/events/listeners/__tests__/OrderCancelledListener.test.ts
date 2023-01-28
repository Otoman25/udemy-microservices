import { OrderCancelledEvent, OrderStatus } from "@thegrinch.learning/common"
import mongoose from "mongoose"
import { Order } from "../../../models/orders"
import { natsWrapper } from "../../../NatsWrapper"
import { OrderCancelledListener } from "../OrderCancelledListener"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: 'test',
        status: OrderStatus.Created,
        price: 10
    })

    await order.save()

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        ticket: {
            id: 'abc'
        },
        version: order.version + 1
    }

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, order, data, message }

}

it('cancels the order', async () => {
    const { listener, data, order, message } = await setup()

    await listener.onMessage(data, message)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acknowledges the message', async () => {
    const { listener, data, message } = await setup()

    await listener.onMessage(data, message)
    expect(message.ack).toHaveBeenCalled()
})