import { AbstractPublisher, Subject, OrderCancelledEvent } from '@thegrinch.learning/common'

export class OrderCancelledPublisher extends AbstractPublisher<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled
}
