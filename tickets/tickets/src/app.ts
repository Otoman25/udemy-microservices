/* eslint-disable @typescript-eslint/no-misused-promises */
import { json } from 'body-parser'
import express from 'express'
import 'express-async-errors' // Allows for auto handling of async routes
import cookieSession from 'cookie-session'
import { create } from './routes/create'
import { NotFoundError, errorHandler, requireAuth, currentUserMiddleware, validateRequest } from '@thegrinch.learning/common'
import { environment } from './utils/environment'
import { createTicketValidator, updateTicketValidator } from './validators/validators'
import { getById } from './routes/getById'
import { get } from './routes/get'
import { update } from './routes/update'

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

app.use(router.get('/api/tickets', get))
app.use(router.post('/api/tickets', requireAuth, createTicketValidator, validateRequest, create))
app.use(router.get('/api/tickets/:id', getById))
app.use(router.put('/api/tickets/:id', requireAuth, updateTicketValidator, validateRequest, update))

app.all('*', async () => {
  throw new NotFoundError() 
})

app.use(errorHandler)

export { app }
