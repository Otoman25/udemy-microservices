import { Publisher, Subject, OrderCreatedEvent } from '@thegrinch.learning/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated
}
