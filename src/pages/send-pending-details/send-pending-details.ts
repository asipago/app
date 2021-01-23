import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { finalize } from 'rxjs/operators';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

@IonicPage()
@Component({
  selector: 'page-send-pending-details',
  templateUrl: 'send-pending-details.html',
})
export class SendPendingDetailsPage {
  
  public currencySymbol: string;

  public link: any;

  private readonly options: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
  };

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    private socialSharing: SocialSharing,
    public dataProvider: DataProvider,
    private readonly geolocation: Geolocation,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly alertCtrl: AlertController,
    public readonly restProvider: RestProvider
  ) {
    this.link = this.navParams.get('link');
    this.link.finalAmount = this.getFinalAmount(this.link.amount);
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  public shareLink() {
    this.socialSharing.share("https://asipago.com/enlace/" + this.link.code, null, null, null);
  }

  public viewLink() {
    this.navCtrl.push('ViewLinkPage', {
      code: this.link.code
    });
  }

  public goHome() {
    this.navCtrl.setRoot('SendPendingPage');
  }

  public removeLink() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Eliminando Enlace...'
    });

    loading.present();

    this.restProvider
        .removeLink(this.link.code)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          if(data.code == this.link.code) {
            this.dismiss();
          } else {
            this.showToast('Error al eliminar enlace, por favor intente nuevamente en unos segundos...');
          }
        }, err => this.showToast('Error al cargar enlace, por favor intente de nuevo...'));
  }

  public processLink() {
    if(this.link.secure) {
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
            .processLink(this.link.code, pin, coords)
            .pipe(finalize(() => loading.dismiss()))
            .subscribe((data: any) => {
              this.showToast("¡Pago Realizado!");
              this.navCtrl.setRoot('AccountResumePage');
            }, error => {
              let message = '';
              switch(error.err) {
                case "Not enough funds": message = "No posee fondos suficientes"; break;
                case "Invalid PIN": message = "¡PIN Inválido!"; break;
                default: message = 'Error al conectar con el servidor, por favor revise su conexión'; break;
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
          type: 'tel'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {}
        },
        {
          text: 'Aceptar',
          handler: data => {
            this.continueProcess(data.pin);
          }
        }
      ]
    });
    alert.present();
  }

  public dismiss() {
    this.navCtrl.pop();
  }

  private getFinalAmount(amount: number) {
    return amount - ((this.dataProvider.getPercent() * amount) / 100);
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
