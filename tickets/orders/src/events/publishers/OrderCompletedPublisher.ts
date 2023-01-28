import { AbstractPublisher, OrderCompletedEvent, Subject } from "@thegrinch.learning/common";

export class OrderCompletedPublisher extends AbstractPublisher<OrderCompletedEvent> {
    readonly subject = Subject.OrderCompleted;
}