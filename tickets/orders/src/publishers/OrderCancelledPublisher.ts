import { Publisher, Subject, OrderCancelledEvent } from '@thegrinch.learning/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled
}
