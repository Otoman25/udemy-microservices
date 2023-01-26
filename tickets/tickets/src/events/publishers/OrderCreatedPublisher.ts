import { AbstractPublisher, Subject, OrderCreatedEvent } from "@thegrinch.learning/common"

export class OrderCreatedPublisher extends AbstractPublisher<OrderCreatedEvent> {
    readonly subject = Subject.OrderCreated;
}