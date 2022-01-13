import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { TransactionQueueItem } from "../models/dto/transactionQueueItem";
import { TransactionEntity } from "../models/entity/transactionEntity";
import { isTransactionEvent, TransactionEvent } from "../models/monzo/transactionEvent";

const cosmosDbBindingName = 'transactionDocument';
const storageQueueBindingName = 'transactionQueueItem';

const mapTransactionEventToEntity = (event: TransactionEvent): TransactionEntity => {
    return {
        accountId: event.data.account_id,
        amount: event.data.amount,
        created: event.data.created,
        currency: event.data.currency,
        description: event.data.description,
        id: event.data.id,
        category: event.data.category,
        isLoad: event.data.is_load,
        settled: event.data.settled,
        merchant: {
            address: {
                address: event.data.merchant.address.address,
                city: event.data.merchant.address.city,
                country: event.data.merchant.address.country,
                latitude: event.data.merchant.address.latitude,
                longitude: event.data.merchant.address.longitude,
                postcode: event.data.merchant.address.postcode,
                region: event.data.merchant.address.region
            },
            created: event.data.merchant.created,
            groupId: event.data.merchant.group_id,
            id: event.data.merchant.id,
            logo: event.data.merchant.logo,
            emoji: event.data.merchant.emoji,
            name: event.data.merchant.name,
            category: event.data.merchant.category
        }
    }
}

export const run: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Webhook received');
    const event = req.body;
    if (!isTransactionEvent(event)) {
        context.res = {
            body: "Ignoring non-transaction event"
        };
        return;
    }

    // Outputs the entity to be saved to the CosmosDB via function output binding
    const transactionEntity = mapTransactionEventToEntity(event);
    context.bindings[cosmosDbBindingName] = JSON.stringify(transactionEntity);

    // Outputs the transaction summary to a queue
    const transactionQueueItem: TransactionQueueItem = {
        accountId: transactionEntity.accountId,
        amount: transactionEntity.amount,
        id: transactionEntity.id
    };
    context.bindings[storageQueueBindingName] = JSON.stringify(transactionQueueItem);
};