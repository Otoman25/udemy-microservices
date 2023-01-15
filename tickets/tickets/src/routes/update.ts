
import { NotAuthorizedError, NotFoundError } from '@thegrinch.learning/common';
import { Request, Response } from 'express'
import { Ticket } from '../models/tickets';

const update = async (req: Request, res: Response): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id)

    if(!ticket) {
      throw new NotFoundError()
    }

    if(ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({
      ...req.body
    })

    await ticket.save()

    res.status(201).send(ticket)
}

export { update }