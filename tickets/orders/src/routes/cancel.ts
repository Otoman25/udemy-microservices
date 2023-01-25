
import { NotAuthorizedError, NotFoundError, OrderStatus } from '@thegrinch.learning/common'
import { Request, Response } from 'express'
import { Order } from '../models/orders'
import { natsWrapper } from '../NatsWrapper'
import { OrderCancelledPublisher } from '../publishers/OrderCancelledPublisher'

const cancel = async (req: Request, res: Response): Promise<void> => {
  const {orderId} = req.params

  const order = await Order.findOne({
    _id: req.params.orderId,
    userId: req.currentUser?.id
  }).populate('ticket')

  if(!order) {
    throw new NotFoundError()
  }

  order.status = OrderStatus.Cancelled
  await order.save()

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    },
    version: order.version
  })

  res.status(201).send()
}

export { cancel }
