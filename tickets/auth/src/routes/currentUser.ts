import express from 'express'

const currentUser = async (req: express.Request, res: express.Response): Promise<void> => {
  res.send({ currentUser: req?.currentUser ?? null })
}

export { currentUser }
