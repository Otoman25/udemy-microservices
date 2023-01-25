import nats, { Message, Stan } from 'node-nats-streaming'
import { Subject } from '../Types/Subjects'

interface Event {
    subject: Subject
    data: any
}

export abstract class AbstractListener<T extends Event> {
    abstract subject: T['subject']
    abstract queueGroupName: string
    abstract onMessage(data: T['data'], message: Message): void

    private client: Stan
    protected ackWait = 5 * 1000

    constructor(client: Stan) {
        this.client = client

        process.on('SIGINT', () => client.close())
        process.on('SIGTERM', () => client.close())
    }

    subscriptionOptions() {
        return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject, 
            this.queueGroupName, 
            this.subscriptionOptions()
        )

        subscription.on('message', (message: Message) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`)

            const parsedData = this.parseMessage(message)
            this.onMessage(parsedData, message)
        })
    }

    parseMessage(message: Message) {
        const data = message.getData()

        switch(typeof data) {
            case 'string':
                try {
                    return JSON.parse(data as string)
                } catch (err) {
                    return data
                }
            case typeof Buffer:
                return JSON.parse(data.toString('utf8'))
        }
    }
}