import { SettingsInterface } from '@interfaces/settings-interface';

export class SettingsModel implements SettingsInterface {
    
    public _settings: {
        noti_payment_pending: boolean,
        noti_payment_received: boolean,
        check_transaction_pin: boolean,
        check_user_device: boolean
    }

    constructor(
        private _noti_payment_pending: boolean,
        private _noti_payment_received: boolean,
        private _check_transaction_pin: boolean,
        private _check_user_device: boolean
    ){}

    get noti_payment_pending(): boolean {
        return this._noti_payment_pending;
    }

    set noti_payment_pending(noti_payment_pending: boolean) {
        this._noti_payment_pending = noti_payment_pending;
    }

    get noti_payment_received(): boolean {
        return this._noti_payment_received;
    }

    set noti_payment_received(noti_payment_received: boolean) {
        this._noti_payment_received = noti_payment_received;
    }

    get check_transaction_pin(): boolean {
        return this._check_transaction_pin;
    }

    set check_transaction_pin(check_transaction_pin: boolean) {
        this.check_transaction_pin = check_transaction_pin;
    }

    get check_user_device(): boolean {
        return this._check_user_device;
    }

    set check_user_device(check_user_device: boolean) {
        this.check_user_device = check_user_device;
    }
}