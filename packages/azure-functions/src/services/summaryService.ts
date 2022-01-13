import { Merchant } from "../models/entity/merchant";
import { TransactionEntity } from "../models/entity/transactionEntity";
import { TransactionsSummary } from "../models/entity/transactionsSummary";

export namespace SummaryService {

    type Count = {
        count: number;
    };

    export const generateSummary = (transactions: TransactionEntity[]): TransactionsSummary => {
        if (!transactions || !transactions.length) {
            return undefined;
        }

        const summary: TransactionsSummary = {
            accountId: transactions[0].accountId,
            id: transactions[0].accountId,
            totalAmount: 0,
            transactionCount: 0,
            topMerchants: []
        };

        const merchants: { [merchantId: string]: Merchant & Count } = {};

        transactions.forEach(transaction => {
            summary.totalAmount += transaction.amount;
            summary.transactionCount++;
            if (!merchants[transaction.merchant.id]) {
                merchants[transaction.merchant.id] = {
                    ...transaction.merchant,
                    count: 1
                };
            } else {
                merchants[transaction.merchant.id].count++;
            }
        });

        const sortedMerchants = Object.values(merchants).sort((a, b) => a.count - b.count);
        summary.topMerchants = sortedMerchants.slice(0, 3);

        return summary;
    }

}