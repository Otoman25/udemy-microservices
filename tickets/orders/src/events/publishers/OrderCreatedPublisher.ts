import { Publisher, OrderCreatedEvent, Subject } from '@thegrinch.learning/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
}
