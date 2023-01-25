import { ExpirationCompleteEvent, Publisher, Subject } from "@thegrinch.learning/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subject.ExpirationComplete;
}