import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/ExpirationCompletePublisher";
import { natsWrapper } from "../NatsWrapper";
import { environment } from "../utils/environment";

interface Payload {
    orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: environment.redis.host
    }
})

expirationQueue.process(async (job) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
})


export { expirationQueue }