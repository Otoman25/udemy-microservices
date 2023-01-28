import { BadRequestError, NotFoundError, OrderStatus } from '@thegrinch.learning/common'
import express, { Request, Response } from 'express'
import { PaymentCreatedPublisher } from '../events/publishers/PaymentCreatedPublisher'
import { Order } from '../models/orders'
import { Payment } from '../models/payment'
import { natsWrapper } from '../NatsWrapper'
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

  if(order.status === OrderStatus.Completed) {
    throw new BadRequestError('Order has already been paid for')
  }

  const charge = await stripe.charges.create({
    amount: order.price * 100,
    currency: 'gbp',
    source: token
  })

  const payment = Payment.build({
    orderId,
    stripeId: charge.id
  })

  await payment.save()

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment._id,
    orderId,
    stripeId: charge.id
  })
  
  res.status(201).send({ id: payment.id })
}

export { create }
