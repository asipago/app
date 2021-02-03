import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { AuthProvider } from "@providers/auth/auth";
import { DataProvider } from "@providers/data/data";

@IonicPage({
  defaultHistory: ['AccountRegisterSuccessfulPage']
})
@Component({
  selector: 'page-account-register-verify',
  templateUrl: 'account-register-verify.html',
})
export class AccountRegisterVerifyPage {

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
    this.restProvider.generateSmsCode(this.username, 'verify').subscribe((data: any) => {
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
        .confirmToken(this.validationCode, "sms_verify")
        .pipe(finalize(() => loading.dismiss()))
      	.subscribe((data: any) => {
      		if(data.status == 'ok') {
            this.navCtrl.setRoot("AccountLoginPage");
            this.showToast("Cuenta verificada, ya puedes iniciar sesión...");
      		} else {
      			this.showToast("Ha ocurrido un error, por favor intenta mas tarde...");
      		}
        }, err => this.showToast("Código Incorrecto"));
  }
  
  public goHome() { this.navCtrl.setRoot('AppHomePage'); }

  private showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

}
