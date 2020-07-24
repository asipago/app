import { DeviceInterface } from '@interfaces/device-interface';

export class DeviceModel implements DeviceInterface {
 
    constructor(
        private _uuid: string,
        private _model: string,
        private _manufacturer: string,
        private _version: string,
        private _platform: string,
        private _serial: string,
        private _isVirtual: boolean
    ){}

    get uuid(): string {
        return this._uuid;
    }

    get model(): string {
        return this._model;
    }

    get manufacturer(): string {
        return this._manufacturer;
    }

    get version(): string {
        return this._version;
    }

    get platform(): string {
        return this._platform;
    }

    get serial(): string {
        return this._serial;
    }

    get isVirtual(): boolean {
        return this._isVirtual;
    }

    get isAndroid(): boolean {
        return this._platform == 'Android';
    }

    get isiOS(): boolean {
        return this._platform == 'iOS';
    }

    get isWindows(): boolean {
        return this._platform == 'Windows';
    }
}