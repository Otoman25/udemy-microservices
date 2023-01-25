import { Publisher, Subject, OrderUpdatedEvent } from '@thegrinch.learning/common'

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  readonly subject = Subject.OrderUpdated
}
