import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TransactionsSummary } from "../models/entity/transactionsSummary";

export const run: AzureFunction = async function (context: Context, req: HttpRequest, summary: TransactionsSummary): Promise<void> {
    const accountId = req.query.accountId;
    if (!accountId) {
        context.res = {
            status: 400,
            body: 'accountId query parameter is requred'
        };
        return;
    }

    context.log(`Requested transaction summary for account ID ${req.query.accountId}`);

    if (!summary) {
        context.res = {
            status: 404,
            body: `Account summary not found for account ID ${req.query.accountId}`
        };
        return;
    }

    context.res = {
        body: summary
    };
};