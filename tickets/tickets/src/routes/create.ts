import express, { Request, Response } from 'express'
import { TicketCreatedPublisher } from '../events/publishers/TicketCreatedPublisher'
import { Ticket } from '../models/tickets'
import { natsWrapper } from '../NatsWrapper'

const create = async (req: express.Request, res: express.Response): Promise<void> => {
    const { title, price } = req.body

    const ticket = Ticket.build({
        userId: req.currentUser!.id,
        title,
        price
    })

    await ticket.save()

    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })

    if(ticket.errors) {
        console.log('Ticket creation error: ', ticket.errors)
        res.sendStatus(501)
    } else {
        res.status(201).send(ticket)
    }
}

export { create }