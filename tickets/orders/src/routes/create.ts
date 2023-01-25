import { BadRequestError, NotFoundError, OrderStatus } from '@thegrinch.learning/common'
import express, { Request, Response } from 'express'
//import { TicketCreatedPublisher } from '../events/publishers/TicketCreatedPublisher'
import { Order } from '../models/orders'
import { Ticket, TicketDocument } from '../models/tickets'
import { natsWrapper } from '../NatsWrapper'
import { OrderCreatedPublisher } from '../publishers/OrderCreatedPublisher'

const EXPIRATION_WINDOW_SECONDS = 15 * 60

const create = async (req: express.Request, res: express.Response): Promise<void> => {
  const { ticketId } = req.body
  // find the ticket the user is trying to order
  const ticket = await Ticket.findById(ticketId)

  if (ticket === null) {
    throw new NotFoundError()
  }

  const alreadyReserved = await ticket.isReserved()
  // make sure the ticket is not already reserved
  if (alreadyReserved) {
    throw new BadRequestError('Ticket is already reserved')
  }

  // calculate expiration date for this order
  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  // build the order and save it
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  })

  await order.save()

  // publish an event saying that an order was created
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    },
    version: order.version
  })

  res.status(201).send(order)
}

export { create }
