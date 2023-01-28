import { OrderCompletedEvent } from "@thegrinch.learning/common"
import mongoose from "mongoose"
import { Order, OrderStatus } from "../../../models/orders"
import { natsWrapper } from "../../../NatsWrapper"
import { OrderCompletedListener } from "../OrderCompletedListener"
import { OrderCreatedListener } from "../OrderCreatedListener"

beforeEach(() => {
    jest.resetAllMocks()
})

it('message is not acknowledged if order doesnt exist', async () => {
    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }
    const listener = new OrderCompletedListener(natsWrapper.client)

    await listener.onMessage({id: new mongoose.Types.ObjectId().toHexString()}, message).catch(err => err)
    
    expect(message.ack).not.toBeCalled()
})

it('updates an order status when payment is complete', async () => {
    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }
    const listener = new OrderCompletedListener(natsWrapper.client)

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: 'test',
        status: OrderStatus.Created,
        price: 10
    })

    await order.save()

    await listener.onMessage({id: order.id}, message)

    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Completed)
    expect(message.ack).toBeCalled()
})