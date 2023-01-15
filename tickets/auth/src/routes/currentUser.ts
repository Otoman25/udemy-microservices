import express from 'express'
import { currentUserMiddleware } from '@thegrinch.learning/common'

const currentUser = async (req: express.Request, res: express.Response): Promise<void> => {
  res.send({ currentUser: req?.currentUser ?? null })
}

export { currentUser }
