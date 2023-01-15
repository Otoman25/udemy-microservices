import express from 'express'
import { BadRequestError, environment } from '@thegrinch.learning/common'
import { User } from '../models/users'
import { compare } from '../utils/password'
import * as jwt from 'jsonwebtoken'

const signin = async (req: express.Request, res: express.Response): Promise<void> => {
  const BAD_LOGIN_ATTEMPT_MESSAGE = 'Unable to sign in'
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser === null) {
    throw new BadRequestError(BAD_LOGIN_ATTEMPT_MESSAGE)
  }

  const passwordsMatch = await compare(existingUser.password, password)

  if (!passwordsMatch) {
    throw new BadRequestError(BAD_LOGIN_ATTEMPT_MESSAGE)
  }

  const userJWT = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, environment.jwt.JWT_KEY)

  req.session = {
    jwt: userJWT
  }

  res.status(200).send(existingUser)
}

export { signin }
