import { CardInterface, CardHolderInterface } from '@interfaces/card-interface';

export class CardModel implements CardInterface {
 
    constructor(
        private _type: string,
        private _number: string,
        private _month: number,
        private _year: number,
        private _cvc: number,
        private _holder?: CardHolderModel
    ){}

    get type(): string {
        return this._type;
    }

    get number(): string {
        return this._number;
    }

    get month(): number {
        return this._month;
    }

    get year(): number {
        return this._year;
    }

    get cvc(): number {
        return this._cvc;
    }

    get holder(): CardHolderModel {
        return this._holder;
    }
}

export class CardHolderModel implements CardHolderInterface {

    constructor(
        private _address: string,
        private _city: string,
        private _country: string,
        private _postal_code: number
    ){}

    get address(): string {
        return this._address;
    }

    get city(): string {
        return this._city;
    }

    get country(): string {
        return this._country;
    }

    get postal_code(): number {
        return this._postal_code;
    }
}