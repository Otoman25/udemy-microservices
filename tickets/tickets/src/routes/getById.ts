
import { NotFoundError } from '@thegrinch.learning/common';
import { Request, Response } from 'express'
import { Ticket } from '../models/tickets';

const getById = async (req: Request, res: Response): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }
  
    res.send(ticket)
}

export { getById }