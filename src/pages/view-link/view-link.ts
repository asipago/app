import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";

@IonicPage()
@Component({
  selector: 'page-view-link',
  templateUrl: 'view-link.html',
})
export class ViewLinkPage {

	code: string;
	secure: boolean;

	qrCode: string = "undefined";

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public readonly restProvider: RestProvider
  ) {
    this.code = navParams.get('code');
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando Datos'
    });

    loading.present();

    this.restProvider
        .getLink(this.code)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          this.secure = data.secure;
          this.qrCode = "https://asipago.com/enlace/" + this.code;
        }, err => this.handleError(err));
  }

	goBack() {
	   this.navCtrl.pop();
	}

  private handleError(error: any) {
    let message: string;
    if (error.status && error.status === 401) {
      message = 'Este enlace ya fue utilizado o ha sido eliminado...';
    }
    else {
      message = `Unexpected error: ${error.statusText}`;
    }

    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

}
