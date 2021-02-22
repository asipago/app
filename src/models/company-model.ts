import { CompanyInterface } from '@interfaces/company-interface';

export class CompanyModel implements CompanyInterface {

    private _funds: number;

    constructor(
        private _id: number,
        private _name: string,
        private _rif: string,
        private _address: string,
        private _phone: string,
        private _email: string,
        private _country: string,
        private _state: string,
        private _zip: string,
        private _alias: string,
        private _image: string,
        private _createdAt: string,
        private _updatedAt: string
    ){}

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get rif(): string {
        return this._rif;
    }

    get address(): string {
        return this._address;
    }

    get phone(): string {
        return this._phone;
    }

    get email(): string {
        return this._email;
    }

    get country(): string {
        return this._country;
    }

    get state(): string {
        return this._state;
    }

    get zip(): string {
        return this._zip;
    }

    get alias(): string {
        return this._alias;
    }

    get image(): string {
        return this._image;
    }

    get createdAt(): string {
        return this._createdAt;
    }

    get updatedAt(): string {
        return this._updatedAt;
    }

    get funds(): number {
        return this._funds;
    }

    set funds(theFunds: number) {
        this._funds = theFunds;
    }
}