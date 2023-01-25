/* eslint-disable @typescript-eslint/no-misused-promises */
import { json } from 'body-parser'
import express from 'express'
import 'express-async-errors' // Allows for auto handling of async routes
import cookieSession from 'cookie-session'
// import { create } from './routes/create'
import { NotFoundError, errorHandler, requireAuth, currentUserMiddleware, validateRequest } from '@thegrinch.learning/common'
import { environment } from './utils/environment'
import { createOrderValidator, updateOrderValidator } from './validators/validators'
import { getById } from './routes/getById'
import { get } from './routes/get'
import { update } from './routes/update'
import { create } from './routes/create'
import { cancel } from './routes/cancel'

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

app.use(router.get('/api/orders', requireAuth, get))
app.use(router.post('/api/orders', requireAuth, createOrderValidator, validateRequest, create))
app.use(router.get('/api/orders/:orderId', getById))
app.use(router.put('/api/orders/:orderId', requireAuth, updateOrderValidator, validateRequest, update))
app.use(router.patch('/api/orders/:orderId', requireAuth, cancel))

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
