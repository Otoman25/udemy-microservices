import express, { Request, Response } from 'express'

const create = async (req: express.Request, res: express.Response): Promise<void> => {
    res.sendStatus(200)
}

export { create }