/* eslint-disable @typescript-eslint/no-misused-promises */
import { json } from 'body-parser'
import express from 'express'
import 'express-async-errors' // Allows for auto handling of async routes
import cookieSession from 'cookie-session'
import { NotFoundError, errorHandler, requireAuth, currentUserMiddleware, validateRequest } from '@thegrinch.learning/common'
import { environment } from './utils/environment'
import { PaymentValidator } from './validators/validators'
import { create } from './routes/create'

const app = express()
const router = express.Router()
app.use(json())

// Setting up HTTPS requirements & cookie settings
app.set('trust proxy', true)
app.use(
  cookieSession({
    signed: false,
    secure: environment.cookieSession.secure
  })
)
app.use(currentUserMiddleware(environment.jwt.JWT_KEY))

app.use(router.post('/api/payments'), requireAuth, PaymentValidator, validateRequest, create)

app.all('*', async () => {
  throw new NotFoundError() 
})

app.use(errorHandler)

export { app }
