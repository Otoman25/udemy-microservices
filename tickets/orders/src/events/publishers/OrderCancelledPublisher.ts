import { Subject, Publisher, OrderCancelledEvent } from '@thegrinch.learning/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
}