import { body } from 'express-validator'
import mongoose from 'mongoose'

export const createOrderValidator = [
  body('ticketId')
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // This would be useful until mongodb gets swapped out on the ticket service
    .withMessage('Ticket ID must be provided')
]

export const updateOrderValidator = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID must be provided')
]
