import { Merchant } from "./merchant";

export interface TransactionEntity {
    accountId: string,
    amount: number,
    created: string,
    currency: string,
    description: string,
    id: string,
    category: string,
    isLoad: boolean,
    settled: string,
    merchant: Merchant
}