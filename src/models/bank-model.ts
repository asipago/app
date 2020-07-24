import { BankInterface } from '@interfaces/bank-interface';

export class BankModel implements BankInterface {
 
    constructor(
        private _id: number,
        private _code: string,
        private _name: string,
        private _alias: string,
        private _color: string
    ){}

    get id(): number {
        return this._id;
    }

    get code(): string {
        return this._code;
    }

    get name(): string {
        return this._name;
    }

    get alias(): string {
        return this._alias;
    }

    get color(): string {
        return this._color;
    }
}