export interface CardInterface {
    type: string;
    number: string;
    month: number;
    year: number;
    cvc: number;
}

export interface CardHolderInterface {
    address: string;
    city: string;
    country: string;
    postal_code: number;
}