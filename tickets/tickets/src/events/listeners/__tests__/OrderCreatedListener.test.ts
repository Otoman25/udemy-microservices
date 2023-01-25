import { OrderCreatedEvent, OrderStatus } from "@thegrinch.learning/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../NatsWrapper"
import { OrderCreatedListener } from "../OrderCreatedListener"

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: 'title',
        price: 10,
        userId: 'abc'
    })

    await ticket.save()

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: "abc",
        expiresAt: "never",
        ticket: {
            id: ticket.id,
            price: ticket.price
        },
        version: 0
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, message}
}

it('it sets the userId of the ticket', async() => {
    const {listener, ticket, data, message} = await setup()

    await listener.onMessage(data, message)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket.orderId).toEqual(data.id)
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

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(data.id).toEqual(ticketUpdatedData.orderId)
})