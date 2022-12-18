/* eslint-disable @typescript-eslint/no-misused-promises */
import { json } from 'body-parser'
import express from 'express'
import 'express-async-errors' // Allows for auto handling of async routes
import cookieSession from 'cookie-session'

import { NotFoundError } from './errors/NotFoundError'
import { errorHandler } from './middlewares/error-handler'

import { currentUser } from './routes/current-user'
import { signin } from './routes/signin'
import { signout } from './routes/signout'
import { signup } from './routes/signup'
import { signinValidator, signupValidator } from './validators/validators'
import { validateRequest } from './middlewares/validate-request'
import { currentUserMiddleware } from './middlewares/current-user'
import { environment } from './utils/environment'

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

app.use(router.get('/api/users/currentuser', currentUserMiddleware, currentUser))
app.use(router.post('/api/users/signin', signinValidator, validateRequest, signin))
app.use(router.post('/api/users/signout', signout))
app.use(router.post('/api/users/signup', signupValidator, validateRequest, signup))

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
