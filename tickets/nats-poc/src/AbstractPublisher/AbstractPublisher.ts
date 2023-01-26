import { Stan } from "node-nats-streaming";
import { Subject } from "../Types/Subjects";

interface Event {
    subject: Subject
    data: any
}

export abstract class AbstractPublisher<T extends Event> {
    abstract subject: T['subject']
    private client: Stan

    constructor(client: Stan) {
        this.client = client

        process.on('SIGINT', () => client.close())
        process.on('SIGTERM', () => client.close())
    }

    publish(data: T['data']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if(err) {
                    reject(err)
                } else {
                    console.log(`Successfully sent data to subject: ${this.subject}`)
                    resolve()
                } 
            })
        })
    }
}