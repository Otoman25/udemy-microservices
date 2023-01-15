import { body } from 'express-validator'

export const createTicketValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title must be a non empty string'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number')
]

export const updateTicketValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title must be a non empty string'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number')
] 