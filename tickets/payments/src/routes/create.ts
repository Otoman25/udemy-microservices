import { BadRequestError, NotFoundError, OrderStatus } from '@thegrinch.learning/common'
import express, { Request, Response } from 'express'
import { Order } from '../models/orders'
import { stripe } from '../stripe'

const create = async (req: express.Request, res: express.Response): Promise<void> => {
  const { token, orderId } = req.body

  const order = await Order.findById(orderId)

  if(order === null || order.userId !== req.currentUser?.id) {
    throw new NotFoundError()
  }

  if(order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Cannot pay for a cancelled order')
  }

  stripe.charges.create({
    amount: order.price,
    currency: 'gbp',
    source: token
  })

  res.status(201).send()
}

export { create }
