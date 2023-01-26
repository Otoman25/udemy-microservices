import { AbstractPublisher, Subject, OrderUpdatedEvent } from '@thegrinch.learning/common'

export class OrderUpdatedPublisher extends AbstractPublisher<OrderUpdatedEvent> {
  readonly subject = Subject.OrderUpdated
}
