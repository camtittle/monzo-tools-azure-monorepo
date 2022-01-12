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
    merchant: {
        address: {
            address: string,
            city: string,
            country: string,
            latitude: number,
            longitude: number,
            postcode: string,
            region: string
        },
        created: string
        groupId: string,
        id: string,
        logo: string,
        emoji: string,
        name: string,
        category: string
    }
}