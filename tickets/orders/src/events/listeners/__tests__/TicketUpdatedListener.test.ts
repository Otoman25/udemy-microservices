import { TicketCreatedEvent, TicketUpdatedEvent } from "@thegrinch.learning/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../NatsWrapper"
import { TicketUpdatedListener } from "../TicketUpdatedListener"

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)
    
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 10
    })

    await ticket.save()

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'tootle',
        price: 1,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: ticket.version + 1
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, data, message, ticket }
}

it('finds, updates and saves a ticket', async () => {
    const {listener, data, message, ticket} = await setup()
    await listener.onMessage(data, message)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it('acknowledges the message', async () => {
    const {listener, data, message} = await setup()

    await listener.onMessage(data, message)

    expect(message.ack).toHaveBeenCalled()
})

it('does not acknowledge the message if a version number has been skipped', async () => {
    const {message, data, listener} = await setup()

    data.version = 10

    try {
        await listener.onMessage(data, message)
    } catch(err) {

    }

    expect(message.ack).not.toHaveBeenCalled()
})