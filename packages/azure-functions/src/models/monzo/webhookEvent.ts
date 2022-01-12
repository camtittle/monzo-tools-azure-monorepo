import { EventType } from "./eventType";

export interface WebhookEvent<TEventData> {
    type: EventType,
    data: TEventData
}