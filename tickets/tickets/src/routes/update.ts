
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@thegrinch.learning/common';
import { Request, Response } from 'express'
import { TicketUpdatedPublisher } from '../events/publishers/TicketUpdatedPublisher';
import { Ticket } from '../models/tickets';
import { natsWrapper } from '../NatsWrapper';

const update = async (req: Request, res: Response): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id)

    if(!ticket) {
      throw new NotFoundError()
    }

    if(ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket')
    }

    if(ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({
      ...req.body
    })

    await ticket.save()

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
  })

    res.status(201).send(ticket)
}

export { update }