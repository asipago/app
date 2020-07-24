import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

import { SettingsModel as Settings } from "@models/settings-model";

import { AuthProvider } from "@providers/auth/auth";
import { DataProvider } from "@providers/data/data";
import { RestProvider } from "@providers/rest/rest";

import { FAIO_NAME } from "@app/config";

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-app-settings',
  templateUrl: 'app-settings.html',
})
export class AppSettingsPage {

	public noti_payment_pending: boolean;
	public noti_payment_received: boolean;

  public check_transaction_pin: boolean;
  public check_user_device: boolean;

  public auth_fingerprint: boolean;

  public fingerprintCapable: boolean;

  constructor(
    public navCtrl: NavController,
    public readonly restProvider: RestProvider,
    private fingerprint: FingerprintAIO,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public storage: Storage,
    public platform: Platform
  ) {
    this.auth_fingerprint = false;
    this.fingerprintCapable = false;
  }

  ionViewWillEnter() {
  	let settings: Settings = this.dataProvider.getSettings();
  	this.noti_payment_pending = settings.noti_payment_pending;
  	this.noti_payment_received = settings.noti_payment_received;
    this.check_transaction_pin = settings.check_transaction_pin;
    this.check_user_device = settings.check_user_device;
    this.storage.get(`${FAIO_NAME}`).then(result => {
      this.auth_fingerprint = result == "enabled"
    });
  }

  ionViewDidLoad() {
    if(this.platform.is('android') || this.platform.is('iphone')) {
      this.fingerprint.isAvailable().then(() => this.fingerprintCapable = true);
    }
  }

  onSelectChange(element: any) {
  	this.dataProvider.setSettings(new Settings(
  		this.noti_payment_pending,
  		this.noti_payment_received,
      this.check_transaction_pin,
      this.check_user_device
  	));
    this.restProvider
        .setPreferences({
        	payment_pending: this.noti_payment_pending,
        	payment_received: this.noti_payment_received,
          request_pin: this.check_transaction_pin,
          check_device: this.check_user_device
        })
        .subscribe((data: any) => {}, err => {});
  }

  authSelectChange(element: any) {
    this.authProvider
        .allowFingerprintLogin(this.auth_fingerprint)
        .subscribe((data: any) => {
          this.storage.set(`${FAIO_NAME}`, data.isAllowed ? "enabled" : "disabled");
        });
  }

  openPage(page) {
    this.navCtrl.push(page);
  }

}
