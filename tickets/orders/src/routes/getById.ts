
import { BadRequestError, NotFoundError } from '@thegrinch.learning/common'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Order } from '../models/orders'

const getById = async (req: Request, res: Response): Promise<void> => {
  if(!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
    throw new BadRequestError('Invalid ID')
  }

  const order = await Order.findOne({
    _id: req.params.orderId,
    userId: req.currentUser?.id
  }).populate('ticket')

  if (order == null) {
    throw new NotFoundError()
  }

  res.send(order)
}

export { getById }
