import { ExpirationCompleteEvent, AbstractPublisher, Subject } from "@thegrinch.learning/common";

export class ExpirationCompletePublisher extends AbstractPublisher<ExpirationCompleteEvent> {
    readonly subject = Subject.ExpirationComplete;
}