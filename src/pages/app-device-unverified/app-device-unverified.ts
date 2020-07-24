import { Component } from '@angular/core';
import { IonicPage, ToastController, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio';

import { Storage } from '@ionic/storage';
import { AuthProvider } from "@providers/auth/auth";

import { FAIO_USER } from "@app/config";

@IonicPage()
@Component({
  selector: 'page-app-device-unverified',
  templateUrl: 'app-device-unverified.html',
})
export class AppDeviceUnverifiedPage {

	private fingerprintOptions: FingerprintOptions;

  private username: string;
  public fingerprintCapable: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  	private platform: Platform,
    private fingerprint: FingerprintAIO,
    private readonly toastCtrl: ToastController,
    private readonly loadingCtrl: LoadingController,
    public readonly authProvider: AuthProvider,
    public readonly storage: Storage
  ) {
    this.fingerprintCapable = false;
    this.username = this.navParams.get('username');

  	this.fingerprintOptions = {
  		clientId: "asipago-app",
  		clientSecret: "asipago-master-app",
      disableBackup: true,
      localizedFallbackTitle: 'Validar Huella',
      localizedReason: 'Por favor, coloca tu huella en el sensor del dispositivo'
    };
    
    const versions = this.platform.versions();
    
    if(versions.android) {
      const androidV = versions.android.num;
      if (androidV > 5) {
        this.checkFaio();
      }
    } else if (versions.ios) {
      this.checkFaio();
    }
  }

  private checkFaio() {
    this.fingerprint.isAvailable().then(result => {
      this.fingerprintCapable = true;
    });
  }

  showSmsValidation() {
    this.navCtrl.push("AppDeviceUnverifiedSmsPage", {
      username: this.username
    });
  }

  showFingerPrintDialog() {
    this.fingerprint.show(this.fingerprintOptions).then((deviceFingerprint: any) => {
      if(deviceFingerprint) {
        this.authProvider
            .confirmToken(this.username, 'fingerprint')
            .subscribe(() => {
              this.storage.set(`${FAIO_USER}`, this.username);
              this.login();
            });
      }
    });
  }

  private login() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Conectando...'
    });

    loading.present();

    this.authProvider
        .getLocation()
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          this.continueLogin(data)
        }, err => this.handleError(err, null));
  }

  private continueLogin(geoLocation: any) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Iniciando Sesión'
    });

    loading.present();

    this.authProvider
      .fingerprintLogin(this.username, geoLocation)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(data => {
        this.authProvider.setSession(data);
        this.authProvider.checkDevice(true);
      }, err => this.handleError(err, geoLocation));
  }

  private handleError(error: any, geoLocation: any) {
    let message: string;

    switch(error.error.err) {
      case "username doesn't exist":
        message = 'La combinacion de usuario y contraseña es incorrecta';
        break;

      case "username doesn't not activated":
        message = 'Antes de iniciar sesión debes validar tu cuenta';
        break;

      case "username and fingerprint required":
        message = 'La huella ingresada no se encuentra autorizada';
        break;

      case 'not-assigned':
        this.navCtrl.setRoot('AppDeviceUnassignedPage');
        break;

      case 'not-allowed':
        this.navCtrl.setRoot('AppDeviceUnallowedPage');
        break;

      case 'not-verified':
        this.navCtrl.setRoot('AppDeviceUnverifiedPage', {
          username: this.username
        });
        break;

      default:
        message = 'Error al iniciar sesion, por favor intente en unos minutos...';
        break;
    }

    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

}
