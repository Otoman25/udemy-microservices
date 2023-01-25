
import { NotFoundError } from '@thegrinch.learning/common'
import { Request, Response } from 'express'
import { Order } from '../models/orders'

const get = async (req: Request, res: Response): Promise<void> => {
  const orders = await Order.find({
    userId: req.currentUser?.id
  }).populate('ticket')

  if (orders === null) {
    throw new NotFoundError()
  }

  res.send(orders)
}

export { get }
