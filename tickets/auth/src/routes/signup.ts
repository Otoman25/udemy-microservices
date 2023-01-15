import express from 'express'
import { BadRequestError } from '@thegrinch.learning/common'
import { User } from '../models/users'
import * as jwt from 'jsonwebtoken'
import { environment } from '../utils/environment'

const signup = async (req: express.Request, res: express.Response): Promise<void> => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })

  if (existingUser !== null) {
    throw new BadRequestError('Email in use')
  }

  const user = User.build({ email, password })
  await user.save()

  // User should now be logged in
  // Generate JWT
  const userJWT = jwt.sign({
    id: user.id,
    email: user.email
  }, environment.jwt.JWT_KEY)

  req.session = {
    jwt: userJWT
  }

  res.status(201).send(user)
}

export { signup }
