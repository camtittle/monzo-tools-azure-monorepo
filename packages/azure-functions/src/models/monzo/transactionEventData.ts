export interface TransactionEventData {
    account_id: string,
    amount: number,
    created: string,
    currency: string,
    description: string,
    id: string,
    category: string,
    is_load: boolean,
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
        group_id: string,
        id: string,
        logo: string,
        emoji: string,
        name: string,
        category: string
    }
}