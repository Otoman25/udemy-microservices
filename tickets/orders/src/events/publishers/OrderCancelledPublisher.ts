import { Subject, AbstractPublisher, OrderCancelledEvent } from '@thegrinch.learning/common';

export class OrderCancelledPublisher extends AbstractPublisher<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
}