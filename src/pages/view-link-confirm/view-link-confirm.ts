import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

import { RestProvider } from '@providers/rest/rest';
import { DataProvider } from '@providers/data/data';

@IonicPage({
  defaultHistory: ['AccountResumePage'],
  segment: 'link/:code'
})
@Component({
  selector: 'page-view-link-confirm',
  templateUrl: 'view-link-confirm.html',
})
export class ViewLinkConfirmPage {
  
  public currencySymbol: string;

  public link: any;
	private linkCode: string;

  public isOwner: boolean = true;
  public isValid: boolean = true;
  private isSecure: boolean;

  public title: string;
  public subtitlea: string;
  public subtitleb: string;

  private readonly options: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
  };

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    private readonly geolocation: Geolocation,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly alertCtrl: AlertController,
    public readonly restProvider: RestProvider,
    public dataProvider: DataProvider
  ) {
  	this.linkCode = navParams.get('code');

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando Datos'
    });

    loading.present();

    this.restProvider
        .getLink(this.linkCode)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((response: any) => {
          this.isOwner = response.isOwner;
          this.isSecure = response.secure;
          this.link.user = response.user_gen.firstname + ' ' + response.user_gen.lastname;
          this.link.date = response.createdAt;
          this.link.amount = response.amount;
          this.link.concept = response.concept;
          if(this.isOwner) {
            this.title = (this.link.type == 'IN' ? 'RECIBIR' : 'ENVIAR') + " PAGO";
            this.subtitlea = "Información del Enlace"
            this.subtitleb = "";
          } else {
            this.title = (this.link.type == 'IN' ? 'ENVIAR' : 'RECIBIR') + " PAGO";
            this.subtitlea = (this.link.type == 'OUT' ? 'De' : 'Para')
            this.subtitleb = this.link.user;
          }
        }, err => this.isValid = false);
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  public removeLink() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Eliminando Enlace...'
    });

    loading.present();

    this.restProvider
        .removeLink(this.linkCode)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          if(data.code == this.linkCode) {
            this.showToast("Enlace eliminado...");
            this.navCtrl.setRoot('AccountResumePage');
          } else {
            this.showToast("Error al eliminar enlace... Intente mas tarde");
          }
        }, err => this.showToast("Error al conectar con el servidor, por favor revise su conexión"));
  }

  public processLink() {
    if(this.isSecure) {
      this.presentPrompt();
    } else {
      this.continueProcess(null);
    }
  }

  private continueProcess(pin: string) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Obteniendo Ubicación'
    });

    loading.present();

    this.geolocation.getCurrentPosition(this.options).then((geo) => {
      let coords = geo.coords.latitude + "," + geo.coords.longitude;
      loading.setContent("Procesando Enlace...");
      this.restProvider
          .processLink(this.linkCode, pin, coords)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe((data: any) => {
            this.showToast("¡Enlace Procesado!");
            this.navCtrl.setRoot('AccountResumePage');
          }, error => {
            let message = 'Error al conectar con el servidor, por favor revise su conexión';
            switch(error.err) {
              case "Not enough funds": message = "No posee fondos suficientes"; break;
              case "Invalid PIN": message = "¡PIN Inválido!"; break;
            } this.showToast(message);
          });
    });
  }

  private presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Enlace Protegido',
      inputs: [
        {
          name: 'pin',
          placeholder: 'PIN',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {}
        },
        {
          text: 'Login',
          handler: data => {
            this.continueProcess(data.pin);
          }
        }
      ]
    });
    alert.present();
  }

  public goHome() {
    this.navCtrl.setRoot('AppHomePage');
  }

  private showToast(message: string): void {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });    
    toast.present();
  }

}
