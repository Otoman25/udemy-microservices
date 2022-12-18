import express from 'express'

const signout = (req: express.Request, res: express.Response): void => {
  req.session = null

  res.sendStatus(200)
}

export { signout }
