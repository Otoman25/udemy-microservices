import mongoose from 'mongoose'
import { app } from './app'
import { environment } from './utils/environment'
import { natsWrapper } from './NatsWrapper'
import { randomBytes } from 'crypto'
import { OrderCreatedListener } from './events/listeners/OrderCreatedListener'
import { OrderCancelledListener } from './events/listeners/OrderCancelledListener'

const start = async (): Promise<void> => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(environment.mongo.connectionString).catch((err) => {
    console.error(err)
  })

  await natsWrapper.connect(environment.nats.clusterId, environment.nats.clientId, environment.nats.connectionString)

  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })

  natsWrapper.client.on('error', (err) => {
    console.log(err)
    natsWrapper.client.close()
  })
  
  process.on('SIGINT', () => natsWrapper.client.close())
  process.on('SIGTERM', () => natsWrapper.client.close())

  new OrderCreatedListener(natsWrapper.client).listen()
  new OrderCancelledListener(natsWrapper.client).listen()

  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })


}

void start()
