import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController, ToastController, Platform } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { RestProvider } from '@providers/rest/rest';

@IonicPage({
  defaultHistory: ['AppSettingsPage']
})
@Component({
  selector: 'page-app-settings-pin',
  templateUrl: 'app-settings-pin.html',
})
export class AppSettingsPinPage {

	@ViewChild(Slides) slides: Slides;

  public oldPinCode: string;
  public oldPinEnabled: boolean;

  public newPinCode: string;
  public newPinEnabled: boolean;

  public conPinCode: string;
  public conPinEnabled: boolean;

  private slideSpeed: number;
  public slideTitle: string;

  public bigScreen: boolean;
  public confirmError: boolean;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    public platform: Platform,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public readonly restProvider: RestProvider
	) {
		this.slideSpeed = 500;
		this.slideTitle = "PIN Actual"

		this.oldPinCode = "";
		this.oldPinEnabled = true;

    this.newPinCode = "";
    this.newPinEnabled = true;

    this.conPinCode = "";
    this.conPinEnabled = true;

    this.bigScreen = true;
    this.confirmError = false;

    this.platform.ready().then((readySource) => {
      this.bigScreen = platform.height() > 626;
    });
  }

  ionViewDidLoad() {
  	this.slides.lockSwipes(true);
  	this.slides.slideTo(0, this.slideSpeed);
  }

  public checkPin() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Validando...'
    });

    loading.present();

    this.restProvider
      .setUserPIN(this.oldPinCode.trim(), this.newPinCode.trim(), 'validate')
      .pipe(finalize(() => loading.dismiss()))
      .subscribe((data: any) => {
      	if(data.status) {
      		this.slides.lockSwipes(false);
					this.slideTitle = "Nuevo PIN"
        	this.slides.slideNext(this.slideSpeed);
        	this.slides.lockSwipes(true);
      	} else {
        	this.showToast('PIN incorrecto');
        }
      }, error => this.showToast('PIN incorrecto'));
  }

  public confirmPin() {
    this.slides.lockSwipes(false);
    this.slideTitle = "Confirmar PIN"
    this.slides.slideNext(this.slideSpeed);
    this.slides.lockSwipes(true);
  }

  public updatePin() {
    this.confirmError = this.conPinCode != this.newPinCode;
    if(!this.confirmError) {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Validando...'
      });

      loading.present();

      this.restProvider
        .setUserPIN(this.oldPinCode.trim(), this.newPinCode.trim(), 'update')
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
        	if(data.status) {
        		this.slides.lockSwipes(false);
  					this.slideTitle = "PIN Actualizado"
          	this.slides.slideNext(this.slideSpeed);
          	this.slides.lockSwipes(true);
          } else {
          	this.showToast('Error al actualizar PIN, por favor intente de nuevo...');
          }
        }, error => this.showToast('PIN incorrecto'));
    }
  }

  public delete() {
    switch(this.slides.getActiveIndex()) {
      case 0:
        this.oldPinCode = this.oldPinCode.substr(0, this.oldPinCode.length - 1);
        this.oldPinEnabled = this.oldPinCode.length < 6;
        break;

      case 1:
        this.newPinCode = this.newPinCode.substr(0, this.newPinCode.length - 1);
        this.newPinEnabled = this.newPinCode.length < 6;
        break;

      case 2:
        this.conPinCode = this.conPinCode.substr(0, this.conPinCode.length - 1);
        this.conPinEnabled = this.conPinCode.length < 6;
        break;
    }
	}

  public cancel() {
  	this.navCtrl.setRoot('AppSettingsPage');
  }

  public add(number: string) {
    switch(this.slides.getActiveIndex()) {
      case 0:
        this.oldPinCode += number;
        this.oldPinEnabled = this.oldPinCode.length < 6;
        break;

      case 1:
        this.newPinCode += number;
        this.newPinEnabled = this.newPinCode.length < 6;
        break;

      case 2:
        this.conPinCode += number;
        this.conPinEnabled = this.conPinCode.length < 6;
        break;
    }
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
