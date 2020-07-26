import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Platform } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import * as moment from 'moment';
import * as jwt_decode from "jwt-decode";

import { Subject, Observable } from "rxjs";

import { Device } from '@ionic-native/device';
import { DeviceModel } from '@models/device-model';

import { DataProvider } from "../data/data"
import { RestProvider } from "../rest/rest"

import { SERVER_URL, SERVER_GEO_API, TOKEN_NAME, FAIO_USER, BANK_LIST, DOCUMENT_NAME } from "@app/config";

@Injectable()
export class AuthProvider {

  private readonly jwtTokenName = `${TOKEN_NAME}`;

  public authUser = new Subject<string>();

  private develop: boolean = true;
  private deviceData: DeviceModel;

  constructor(
    public platform: Platform,
    private readonly httpClient: HttpClient,  
    private readonly device: Device,
    public dataProvider: DataProvider,
    public restProvider: RestProvider,
    public storage: Storage
  ) {
    this.platform.ready().then(() => {
      this.deviceData = !this.develop ? 
        new DeviceModel(
          this.device.uuid, this.device.model, this.device.manufacturer,
          this.device.version, this.device.platform, this.device.serial,
          this.device.isVirtual
        ) : new DeviceModel(
          "914e28cb9e5bafc0", "SM-J510MN", "samsung",
          "7.1.1", "Android", "29d7054b", false
        );
    });
  }

  /*checkLogin() {
    this.storage.get(this.jwtTokenName).then(jwt => {
      if (jwt && !this.jwtHelper.isTokenExpired(jwt)) {
        this.httpClient.get(`${SERVER_URL}/banks`) //FIX TO -> AUTH/CHECK_TOKEN
          .subscribe(() => this.authUser.next(jwt),
            (err) => this.storage.remove(this.jwtTokenName).then(() => this.authUser.next(1)));
        // OR
        // this.authUser.next(jwt);
      } else {
        this.logout();
      }
    });
  }*/

  autoLogin(jwt) {
    if (this.isLoggedIn()) {
      this.restProvider.getSessionData().then(data => {
        this.setSession({
          user: data, token: jwt
        }); this.checkDevice(true);      
      }).catch(err => {
        this.authUser.next('invalid-token');
      });
    } else {
      this.authUser.next('token-expired');
    }
  }

  checkDevice(autologin?: boolean) {
    this.httpClient.get(`${SERVER_URL}/auth/device`, {
      params: {
        user: this.dataProvider.getUserName(),
        device: this.deviceData.uuid
      }
    }).subscribe(() => {
      this.authUser.next(autologin ? 'login-ok' : 'device-ok');
    }, (data: any) => {
      switch (data.error.err) {
        case 'no-user':
          this.logout()
          break;

        default:
          this.authUser.next(data.error.err);
          break;
      }
    });
  }

  /* checkFingerprint(fingerprint: string) {
    return this.httpClient.post(`${SERVER_URL}/auth/fingerprint`, {
      device: this.deviceData.uuid, fingerprint: fingerprint
    }, {responseType: 'json'});
  } */

  confirmToken(code: string, type: string) {
    return this.httpClient.post(`${SERVER_URL}/auth/confirmToken`, {
      device: this.deviceData.uuid, token: code, action: type
    }, {responseType: 'json'});
  }

  login(username: string, password: string, location: any, onlyPassword: boolean): Observable<any> {
    return this.httpClient.post(`${SERVER_URL}/auth/${onlyPassword ? 'password' : 'login/app'}`, {
      username: username,
      password: password,
      location: location,
      device: {
        uuid: this.deviceData.uuid,
        model: this.deviceData.model,
        manufacturer: this.deviceData.manufacturer,
        version: this.deviceData.version,
        platform: this.deviceData.platform,
        serial: this.deviceData.serial
      }
    }, {responseType: 'json'});
  }

  fingerprintLogin(username: string, location: any): Observable<any> {
    return this.httpClient.post(`${SERVER_URL}/auth/fingerprint`, {
      username: username.toLowerCase(),
      location: location,
      device: {
        uuid: this.deviceData.uuid,
        model: this.deviceData.model,
        manufacturer: this.deviceData.manufacturer,
        version: this.deviceData.version,
        platform: this.deviceData.platform,
        serial: this.deviceData.serial
      }
    }, {responseType: 'json'});
  }

  logout() {
    this.storage.remove(this.jwtTokenName).then(() => this.authUser.next('logout'));
  }

  signup(values: any): Observable<any> {
    values.app = true;
    values.zip = "4001";
    values.country = "VE";
    return this.httpClient.post(`${SERVER_URL}/users`, values, {responseType: 'json'});
  }

  getLocation() {
    return this.httpClient.get(`${SERVER_GEO_API}`);
  }

  getLastLogin() {
    return this.httpClient.get(`${SERVER_URL}/users/lastSuccessLogin`);
  }

  async isLoggedIn() {
    const expiration = await this.storage.get("expires_at");
    return moment().isBefore(moment(JSON.parse(expiration)));
  }

  async setSession(authResult) {
    authResult.expiresIn = this.getDecodedAccessToken(authResult.token).exp;
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    this.storage.set(this.jwtTokenName, authResult.token);
    this.storage.set("expires_at", JSON.stringify(expiresAt.valueOf()));

    this.storage.set(DOCUMENT_NAME, authResult.user.nationality + "-" + authResult.user.document);
    this.dataProvider.setUser(authResult.user);

    this.storage.set(`${FAIO_USER}`, this.dataProvider.getUserName());

    const bankList = await this.restProvider.getBanks().toPromise();
    this.dataProvider.setBanks(bankList);
  
    const bankAccounts = await this.restProvider.getBanksInfo().toPromise();
    await this.storage.set(BANK_LIST, JSON.stringify(bankAccounts));
  }

  async switchWallet(value: string){
    await this.storage.set(DOCUMENT_NAME, value);
    // this.authUser.next('switch-wallet');
  }

  async isOwnerWallet() {
    const current_document = await this.storage.get(DOCUMENT_NAME);
    return this.dataProvider.getUserDocument() === current_document;
  }

  private getDecodedAccessToken(token: string): any {
    try { return jwt_decode(token); }
    catch(Error) { return null; }
  }

  isVirutalDevice() {
    return this.develop ? false : this.deviceData.isVirtual || this.deviceData.uuid == null || this.deviceData.platform == null;
  }

  allowFingerprintLogin(value: boolean) {
    return this.httpClient.post(`${SERVER_URL}/users/updateFingerprint`, {
      allow: value, device: this.deviceData.uuid
    });
  }

  forgot(email: string) {
    return this.httpClient.post(`${SERVER_URL}/auth/forgot`, {email: email}, {responseType: 'json'});
  }

  questions(token: string) {
    return this.httpClient.post(`${SERVER_URL}/auth/getQuestions`, {token: token}, {responseType: 'json'});
  }

  reset(values: {
    token: string;
    questionA: string;
    questionB: string;
    answerA: string;
    answerB: string;
    option: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.httpClient.post(`${SERVER_URL}/auth/reset`, values, {responseType: 'json'});
  }

}