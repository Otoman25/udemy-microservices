import { body } from 'express-validator'

export const createTicketValidator = [
  body('title')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Title must be a non empty string'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Password must be between 4 and 20 characters')
]