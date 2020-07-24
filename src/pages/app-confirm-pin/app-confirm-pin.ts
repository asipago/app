import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { RestProvider } from '@providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-app-confirm-pin',
  templateUrl: 'app-confirm-pin.html',
})
export class AppConfirmPinPage {

  public pinCode: string;
  public pinEnabled: boolean;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl : ViewController,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public readonly restProvider: RestProvider
	) {
		this.pinCode = "";
		this.pinEnabled = true;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  public checkPin() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Validando...'
    });

    loading.present();

    this.restProvider
      .checkUserPIN(this.pinCode.trim())
      .pipe(finalize(() => loading.dismiss()))
      .subscribe((data: any) => {
      	if(data.status) {
      		this.viewCtrl.dismiss(this.pinCode);
      	} else {
        	this.showToast('PIN incorrecto');
        }
      }, error => this.showToast('PIN incorrecto'));
  }

  public delete() {
		this.pinCode = this.pinCode.substr(0, this.pinCode.length - 1);
		this.pinEnabled = this.pinCode.length < 6;
	}

  public add(number: string) {
		this.pinCode += number;
		this.pinEnabled = this.pinCode.length < 6;
  }

  private showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

}
