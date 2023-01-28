import mongoose from 'mongoose'
import { app } from './app'
import { environment } from './utils/environment'

const start = async (): Promise<void> => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(environment.mongo.connectionString).catch((err) => {console.error(err)})

  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })


}

void start()
