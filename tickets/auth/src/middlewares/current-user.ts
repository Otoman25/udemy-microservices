import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { environment } from '../utils/environment'

interface UserPayload {
  id: string
  email: string
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUserMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session?.jwt === undefined) {
    next()
    return
  }

  try {
    const decodedToken = jwt.verify(req.session?.jwt, environment.jwt.JWT_KEY) as UserPayload
    req.currentUser = decodedToken
  } finally {
    next()
  }
}
