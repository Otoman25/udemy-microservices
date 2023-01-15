import express, { Request, Response } from 'express'
import { Ticket } from '../models/tickets'

const create = async (req: express.Request, res: express.Response): Promise<void> => {
    const { title, price } = req.body

    const ticket = Ticket.build({
        userId: req.currentUser!.id,
        title,
        price
    })

    await ticket.save()

    if(ticket.errors) {
        console.log('Ticket creation error: ', ticket.errors)
        res.sendStatus(501)
    } else {
        res.status(201).send(ticket)
    }
}

export { create }