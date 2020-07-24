import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { AuthProvider } from "@providers/auth/auth";
import { DataProvider } from "@providers/data/data";

@IonicPage({
  defaultHistory: ['AppDeviceUnverifiedPage']
})
@Component({
  selector: 'page-app-device-unverified-sms',
  templateUrl: 'app-device-unverified-sms.html',
})
export class AppDeviceUnverifiedSmsPage {

  private username: string;
  public sendError: boolean = false;

  public validationCode: string = "";
	public canResend: boolean = false;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public readonly authProvider: AuthProvider,
    public readonly restProvider: RestProvider,
    public readonly dataProvider: DataProvider,
    public readonly storage: Storage
  ) {
    this.username = this.navParams.get('username');
  }

  ionViewDidLoad() { this.sendCode(); }

  public sendCode() {
    this.canResend = false;
    this.sendError = false;
    this.restProvider.generateCode(this.username, 'device').subscribe(() => {
      setTimeout(() => {
        this.canResend = true;
      }, 60000);
    }, () => {
      this.sendError = true;
    });
  }

  public validate() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Validando...'
    });

    loading.present();

  	this.authProvider
        .confirmToken(this.validationCode, "sms_device")
        .pipe(finalize(() => loading.dismiss()))
      	.subscribe((data: any) => {
      		if(data.status == 'ok') {
            this.login();
      		} else {
      			this.showToast("Ha ocurrido un error, por favor intenta mas tarde...");
      		}
        }, err => this.showToast("Código Incorrecto"));
  }

  private showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
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
          this.continueLogin(data);
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

      case "username and password required":
        message = 'Ingresa un nombre de usuario y contraseña';
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

    this.showToast(message);
  }

}
