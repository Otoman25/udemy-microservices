import { TicketCreatedEvent } from "@thegrinch.learning/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../NatsWrapper"
import { TicketCreatedListener } from "../TicketCreatedListener"

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client)
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 1,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, data, message }
}

it('creates and saves a ticket', async () => {
    const {listener, data, message} = await setup()
    await listener.onMessage(data, message)
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.id).toEqual(data.id)
})

it('acknowledges the message', async () => {
    const {listener, data, message} = await setup()

    await listener.onMessage(data, message)

    expect(message.ack).toHaveBeenCalled()
})