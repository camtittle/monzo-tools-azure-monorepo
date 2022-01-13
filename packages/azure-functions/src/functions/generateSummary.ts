import { AzureFunction, Context } from "@azure/functions";
import { TransactionEntity } from "../models/entity/transactionEntity";
import { SummaryService } from "../services/summaryService";

const transactionsBindingName = 'transactions';
const summaryBindingName = 'summaryOutput';

export const run: AzureFunction = async function(context: Context): Promise<void> {
    context.log('Generate summary funtion triggered');

    const transactions: TransactionEntity[] = context.bindings[transactionsBindingName];

    const summary = SummaryService.generateSummary(transactions);

    context.log(summary);
    context.log(JSON.stringify(summary));
    context.bindings[summaryBindingName] = JSON.stringify(summary);
}