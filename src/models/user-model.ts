import { UserInterface } from '@interfaces/user-interface';

import { SettingsModel } from './settings-model';

export class UserModel implements UserInterface {

    private _funds: number;
    private _settings: SettingsModel;

    constructor(
        private _id: number,
        private _firstname: string,
        private _lastname: string,
        private _nationality: string,
        private _document: string,
        private _birthday: string,
        private _address: string,
        private _phoneA: string,
        private _phoneB: string,
        private _country: string,
        private _state: string,
        private _zip: string,
        private _active: boolean,
        private _username: string,
        private _image: string,
        private _email: string,
        private _deletedAt: string,
        private _deletedReason: string,
        private _createdAt: string,
        private _updatedAt: string
    ){}

    get id(): number {
        return this._id;
    }

    get firstname(): string {
        return this._firstname;
    }

    get lastname(): string {
        return this._lastname;
    }

    get nationality(): string {
        return this._nationality;
    }

    get document(): string {
        return this._document;
    }

    get birthday(): string {
        return this._birthday;
    }

    get address(): string {
        return this._address;
    }

    get phoneA(): string {
        return this._phoneA;
    }

    get phoneB(): string {
        return this._phoneB;
    }

    get email(): string {
        return this._email;
    }

    get image(): string {
        return this._image;
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

    get active(): boolean {
        return this._active;
    }

    get username(): string {
        return this._username;
    }

    get deletedAt(): string {
        return this._deletedAt;
    }

    get deletedReason(): string {
        return this._deletedReason;
    }

    get createdAt(): string {
        return this._createdAt;
    }

    get updatedAt(): string {
        return this._updatedAt;
    }

    get current(): string {
        return this._nationality + '-' + this._document;
    }

    get funds(): number {
        return this._funds;
    }

    set funds(theFunds: number) {
        this._funds = theFunds;
    }

    get settings(): SettingsModel {
        return this._settings;
    }

    set settings(settings: SettingsModel) {
        this._settings = settings;
    }
}