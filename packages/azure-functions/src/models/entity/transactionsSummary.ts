import { Merchant } from "./merchant";

export interface TransactionsSummary {
    accountId: string;
    id: string;
    totalAmount: number;
    transactionCount: number;
    topMerchants: Merchant[];
}