import { randomBytes } from "crypto";
import nats, { Message } from "node-nats-streaming";
import { AbstractListener } from "./AbstractListener/AbstractListener";
import { Subject } from "./Types/Subjects";
import { TicketCreatedEvent } from "./Types/TicketEvents";

class TicketCreatedListener extends AbstractListener<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], message: Message): void {
        console.log('TicketCreatedListener - ', data)

        message.ack()
    }

}

console.clear()
const clientId = randomBytes(4).toString('hex')
const client = nats.connect('ticketing', clientId, {
    url: 'http://localhost:4222',
    
})

client.addListener('connect', () => {
    console.log('Listener connected to nats - Client ID: ', clientId)
    const ticketCreatedListener = new TicketCreatedListener(client).listen()

    client.on('close', () => {
        console.log('NATS connection closed')
        process.exit()
    })
})


// process.on('SIGINT', () => ticketCreatedListener.close())
// process.on('SIGTERM', () => ticketCreatedListener.close())