
import { NotFoundError } from '@thegrinch.learning/common';
import { Request, Response } from 'express'
import { Ticket } from '../models/tickets';

const get = async (req: Request, res: Response): Promise<void> => {
    const tickets = await Ticket.find({ orderId: undefined });

    if (!tickets) {
      throw new NotFoundError();
    }
  
    res.send(tickets)
}

export { get }