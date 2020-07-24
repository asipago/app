import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, Platform, Keyboard } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import { Storage } from '@ionic/storage';
import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio';

import { AuthProvider } from "@providers/auth/auth";
import { DataProvider } from "@providers/data/data";

import { FAIO_NAME, FAIO_USER } from "@app/config";

@IonicPage({
  defaultHistory: ['AppHomePage']
})
@Component({
  selector: 'page-account-login',
  templateUrl: 'account-login.html',
})
export class AccountLoginPage {

  public mainForm: FormGroup;

  public type: string = 'password';
  public showPass: boolean = false;

  public isLoading: boolean = true;
  public authFingerprint: boolean;

  private readonly fingerprintOptions: FingerprintOptions;

  constructor(
    public readonly authProvider: AuthProvider,
    private readonly navCtrl: NavController,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public keyboard: Keyboard,
    public dataProvider: DataProvider,
    private fingerprint: FingerprintAIO,
    public storage: Storage,
    public platform: Platform
  ) {
    this.mainForm = new FormGroup({
      username: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.minLength(5),
        Validators.required
      ]),
    });

    this.fingerprintOptions = {
      clientId: "asipago-app",
      clientSecret: "asipago-master-app",
      disableBackup: true,
      localizedFallbackTitle: 'Verificar Huella',
      localizedReason: 'Por favor coloque su huella'
    };
  }

  ionViewDidLoad() {
    if(this.authProvider.isVirutalDevice()) {
      this.navCtrl.setRoot('AppDeviceUnsupportedPage');
    } else {
      this.storage.get(`${FAIO_NAME}`).then(async result => {
        this.isLoading = false;
        this.authFingerprint = result == "enabled";
        if(this.authFingerprint && (this.platform.is('android') || this.platform.is('iphone'))) {
          const faio_user = await this.storage.get(`${FAIO_USER}`);
          this.mainForm.get('username').setValidators(null);
          this.mainForm.patchValue({ username: faio_user });
          this.checkFingerprint();
        }
      });
    }
  }

  checkFingerprint() {
    this.fingerprint.show(this.fingerprintOptions).then((deviceFingerprint: any) => {
      if(deviceFingerprint) {
        this.login('faio');
      }        
    });
  }

  login(type: string) {
    
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Conectando...'
    });

    loading.present();

    this.authProvider
        .getLocation()
        .timeout(10000)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          this.continueLogin(data, type)
        }, err => this.handleError(err, null));
  }

  private continueLogin(geoLocation: any, loginType: string) {

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Iniciando Sesión'
    });

    loading.present();

    switch(loginType) {
      case 'faio':
        this.authProvider
          .fingerprintLogin(this.mainForm.value.username, geoLocation)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe(data => {
            this.authProvider.setSession(data);
            this.authProvider.checkDevice(true);
          }, err => this.handleError(err, geoLocation));
        break;

      default:
        this.authProvider
          .login(this.mainForm.value.username, this.mainForm.value.password, geoLocation, this.authFingerprint)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe(data => {
            this.authProvider.setSession(data);
            this.authProvider.checkDevice(true);
          }, err => this.handleError(err, geoLocation));
        break;
    }
  }

  public register() {
  	this.navCtrl.push('AccountRegisterPage');
  }

  public forgot() {
    // window.open("https://www.asipago.com/entrar/recuperar",'_system', 'location=yes');
    this.navCtrl.push('AppForgotPage');
  }

  private handleError(error: any, geoLocation: any) {
    let message: string;

    switch(error.error.err) {
      case "invalid username/password combination":
      case "username doesn't exist":
      case "wrong password":
      case "forbidden":
        message = 'La combinación de usuario y contraseña es incorrecta';
        break;

      case "username isn't activated":
        message = 'Antes de iniciar sesión debes validar tu cuenta';
        break;

      case "username and password required":
        message = 'Ingresa un nombre de usuario y contraseña';
        break;

      case 'no geolocation found':
        message = 'Error al validar los datos, por favor verifica tu conexión a internet e intenta de nuevo';
        break;

      case 'not-assigned':
        this.navCtrl.setRoot('AppDeviceUnassignedPage');
        break;

      case 'not-allowed':
        this.navCtrl.setRoot('AppDeviceUnallowedPage');
        break;

      case 'not-verified':
        this.navCtrl.setRoot('AppDeviceUnverifiedPage', {
          username: this.mainForm.value.username
        });
        break;

      default:
        message = 'Error al iniciar sesión, por favor verifica tu conexión a internet e intenta de nuevo';
        break;
    }

    this.isLoading = false;

    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();

    /*if (error.status && error.status === 401) {
      message = error.error.err == "username doesn't exist" ?
        'La combinacion de usuario y contraseña es incorrecta' :
        'Error al iniciar sesion, por favor intente en unos minutos...';
    }
    else {
      message = `Unexpected error: ${error.statusText}`;
    }*/
  }

  public showPassword() {
    this.showPass = !this.showPass;
    this.type = this.showPass ? 'text' : 'password';
  }

}
