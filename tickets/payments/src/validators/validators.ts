import { body } from "express-validator";

export const PaymentValidator = [
  body('token')
  .notEmpty(),
  body('orderId')
      .notEmpty()
  ]
  