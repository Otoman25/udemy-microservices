import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const clientId = randomBytes(4).toString('hex')

const client = nats.connect('ticketing', clientId, {
    url: 'http://localhost:4222',
    
})

client.addListener('connect', () => {
    console.log('Listener connected to nats - Client ID: ', clientId)

    client.on('close', () => {
        console.log('NATS connection closed')
        process.exit()
    })

    const options = client
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('orders-service')

    /*
        Summary: if you enable setDeliverAllAvailable and setDurableName without a queue name, then
            every time a client disconnects, the durable subscription history will be reset. When it
            reconnects, the whole history will be sent again.
        If you combine the above with a queue name, the history of messages (including which ones have
            been processed) will be preserved and when a client reconnects only the unacknowledged messages
            will be resent

    */
    const subscription = client.subscribe('ticket:created', 'orders-service-queue', options)

    subscription.addListener('message', (message: Message) => {
        const data = message.getData()

        if(typeof data === 'string') {
            console.log(`Received event #${message.getSequence()} with data: ${data}`)
        }

        console.log('Processing completed')
        message.ack() // Acknowledge message received and doesn't need to be resent
    })
})

process.on('SIGINT', () => client.close())
process.on('SIGTERM', () => client.close())