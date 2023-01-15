/* eslint-disable @typescript-eslint/no-misused-promises */
import { json } from 'body-parser'
import express from 'express'
import 'express-async-errors' // Allows for auto handling of async routes
import cookieSession from 'cookie-session'

import { NotFoundError, errorHandler, validateRequest, currentUserMiddleware, environment } from '@thegrinch.learning/common'

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

// app.use(router.post('/api/users/signup', signupValidator, validateRequest, signup))

// // Example of an async route
// app.all('*', async (req, res, next) => {
//     next(new NotFoundError());
// })

// This one uses the benefits from 'express-async-errors'
app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
