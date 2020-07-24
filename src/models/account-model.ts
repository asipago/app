import { AccountInterface } from '@interfaces/account-interface';

import { BankModel } from './bank-model';

export class AccountModel implements AccountInterface {
 
    constructor(
        private _id: number,
        private _code: string,
        private _type: string,
        private _verified: boolean,
        private _bank: BankModel
    ){}

    get id(): number {
        return this._id;
    }

    get code(): string {
        return this._code;
    }

    get type(): string {
        return this._type;
    }

    get verified(): boolean {
        return this._verified;
    }

    get bank(): BankModel {
        return this._bank;
    }

    get isChecking(): boolean {
        return this._type == "A";
    }

    get isSaving(): boolean {
        return this._type == "S";
    }
}