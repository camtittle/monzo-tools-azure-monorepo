export interface Merchant {
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