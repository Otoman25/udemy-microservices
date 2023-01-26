import { AbstractPublisher, PaymentCreatedEvent, Subject } from "@thegrinch.learning/common";

export class PaymentCreatedPublisher extends AbstractPublisher<PaymentCreatedEvent> {
    readonly subject = Subject.PaymentCreated;
}