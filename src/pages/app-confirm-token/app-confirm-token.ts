import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';

import { AuthProvider } from '@providers/auth/auth';
import { TOKEN_NAME } from "@app/config";

@IonicPage({
  defaultHistory: ['AppHomePage'],
  segment: 'validar/:type/:token',
})
@Component({
  selector: 'page-app-confirm-token',
  templateUrl: 'app-confirm-token.html',
})
export class AppConfirmTokenPage {

	private type: string;
	private token: string;

	public isValid: boolean = false;
	public isValidating: boolean = true;

  private readonly jwtTokenName = `${TOKEN_NAME}`;
  
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public readonly authProvider: AuthProvider,
    public storage: Storage,
    platform: Platform
  ) {
  	this.type = navParams.get('type');
    this.token = navParams.get('token');
    
    if(this.type == 'clave') {
      this.navCtrl.setRoot('AppForgotResetPage', {
        token: this.token
      });
    } else {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Verificando Datos'
      });
  
      loading.present();
  
      platform.ready().then(() => {
        this.authProvider
            .confirmToken(this.token, this.type)
            .pipe(finalize(() => loading.dismiss()))
            .subscribe((response: any) => {
              this.isValid = true;
              this.isValidating = false;
            }, err => this.showToast("El enlace no es válido o ha expirado"));
      });
    }
	}

  public changePage(): void {
    this.storage.get(this.jwtTokenName).then(jwt => {
      if(!jwt) {
        this.navCtrl.setRoot('AppHomePage');
      } else {
        this.authProvider.autoLogin(jwt);
      }
    });
  }

  private showToast(message: string): void {
    this.isValid = false;
    this.isValidating = false;
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });    
    toast.present();
  }

}