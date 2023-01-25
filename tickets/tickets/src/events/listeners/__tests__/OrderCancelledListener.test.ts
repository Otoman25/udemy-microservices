import { OrderCancelledEvent, OrderStatus } from "@thegrinch.learning/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../NatsWrapper"
import { OrderCancelledListener } from "../OrderCancelledListener"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = new mongoose.Types.ObjectId().toHexString()

    const ticket = Ticket.build({
        title: 'title',
        price: 10,
        userId: 'abc'
    })

    ticket.set({ orderId })

    await ticket.save()

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        ticket: {
            id: ticket.id
        },
        version: 0
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, message, orderId}
}

it('it removed the orderId of the ticket', async() => {
    const {listener, ticket, data, message, orderId} = await setup()

    await listener.onMessage(data, message)

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket.orderId).not.toBeDefined()


})

it('acks the message', async() => {
    const {listener, data, message} = await setup()

    await listener.onMessage(data, message)

    expect(message.ack).toHaveBeenCalled()
    
})

it('publishes a ticket updated event', async () => {
    const {listener, data, message} = await setup()

    await listener.onMessage(data, message)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})