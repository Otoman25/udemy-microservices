import mongoose from 'mongoose'
import { app } from './app'

const start = async (): Promise<void> => {
  await mongoose.connect('mongodb://auth-mongo-srv:27017/auth').catch((err) => {
    console.error(err)
  })

  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })


}

void start()
