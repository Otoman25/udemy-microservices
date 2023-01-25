
import { NotAuthorizedError, NotFoundError } from '@thegrinch.learning/common'
import { Request, Response } from 'express'
import { Order } from '../models/orders'
import { natsWrapper } from '../NatsWrapper'

const update = async (req: Request, res: Response): Promise<void> => {

  res.status(200)
}

export { update }
