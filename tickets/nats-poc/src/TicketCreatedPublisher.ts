import { randomBytes } from "crypto"
import { AbstractPublisher } from "./AbstractPublisher/AbstractPublisher"
import { Subject } from "./Types/Subjects"
import { TicketCreatedEvent } from "./Types/TicketEvents"
import nats from 'node-nats-streaming'

export class TicketCreatedPublisher extends AbstractPublisher<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated;
}

console.clear()
const clientId = randomBytes(4).toString('hex')
const client = nats.connect('ticketing', clientId, {
    url: 'http://localhost:4222',
    
})

client.addListener('connect', async () => {
    console.log('Listener connected to nats - Client ID: ', clientId)
    const ticketCreatedPublisher = new TicketCreatedPublisher(client)

    try {
        await ticketCreatedPublisher.publish({
            id: '1',
            price: 20,
            title: 'Title'
        })
    } catch (err) {
        console.log(err)
    }
    

    client.on('close', () => {
        console.log('NATS connection closed')
        process.exit()
    })
})