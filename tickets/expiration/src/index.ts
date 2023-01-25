import { environment } from './utils/environment'
import { natsWrapper } from './NatsWrapper'
import { OrderCreatedListener } from './events/listeners/OrderCreatedListener'

const start = async (): Promise<void> => {
  await natsWrapper.connect(environment.nats.clusterId, environment.nats.clientId, environment.nats.connectionString)

  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })

  natsWrapper.client.on('error', (err) => {
    console.log(err)
    natsWrapper.client.close()
  })

  new OrderCreatedListener(natsWrapper.client).listen()
  
  process.on('SIGINT', () => natsWrapper.client.close())
  process.on('SIGTERM', () => natsWrapper.client.close())
}

void start()
