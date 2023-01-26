import { AbstractPublisher, OrderCreatedEvent, Subject } from '@thegrinch.learning/common';

export class OrderCreatedPublisher extends AbstractPublisher<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
}
