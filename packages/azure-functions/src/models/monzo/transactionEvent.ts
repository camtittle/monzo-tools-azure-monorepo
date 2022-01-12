import { EventType } from "./eventType";
import { TransactionEventData } from "./transactionEventData";
import { WebhookEvent } from "./webhookEvent";

export type TransactionEvent = WebhookEvent<TransactionEventData>;

export const isTransactionEvent = (event: WebhookEvent<any>): event is WebhookEvent<TransactionEventData> => {
    return event.type === EventType.TransactionCreated;
};