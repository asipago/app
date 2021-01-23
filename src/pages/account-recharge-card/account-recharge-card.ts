import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

import { AuthProvider } from '@providers/auth/auth';
import { RestProvider } from '@providers/rest/rest';
import { DataProvider } from '@providers/data/data';
import { CardInterface } from '@interfaces/card-interface';

@IonicPage({
  defaultHistory: ['AccountRechargePage']
})
@Component({
  selector: 'page-account-recharge-card',
  templateUrl: 'account-recharge-card.html',
})
export class AccountRechargeCardPage {

  private cardId: string;
  public cardNumber: string;
  public cardBrand: string;
  public cardMonth: string;
  public cardYear: string;

  public username: string;

  public cards: any = [];
  public selectedCard: CardInterface;
  //public availableFunds: number = 0;
  
  public mainForm: FormGroup;
  public currencySymbol: string;

  private readonly options: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
  };

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly restProvider: RestProvider,
    private readonly geolocation: Geolocation,
    public readonly storage: Storage,
    public dataProvider: DataProvider,
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    public navParams: NavParams
  ) {
    this.cardId = navParams.get('id');
    this.cardNumber = navParams.get('number');
    this.cardBrand = navParams.get('brand');
    this.cardMonth = navParams.get('month');
    this.cardYear = navParams.get('year');

    this.mainForm = this.formBuilder.group({
      amount: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{1,6}([,|.][0-9]{1,2})?$'),
        Validators.required
      ])),
    });
  }

  ionViewWillEnter() {
    this.username = this.dataProvider.getUserName();
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
    /* this.restProvider.getFunds().then(wallet => {
      this.availableFunds = wallet.funds;
    }); */
  }

  showAlert() {
    const amount = this.mainForm.value.amount;
    const amountText = this.currencyPipe.transform(amount, this.currencySymbol, 'code', '1.2-2', 'es');

    let alert = this.alertCtrl.create({
      title: 'Confirmar recarga',
      message: '<p>Monto: ' + amountText + '</p><p>Tarjeta: ****' + this.cardNumber + '</p>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Continuar',
          handler: () => {
            let loading = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Obteniendo Ubicación'
            });

            loading.present();
            
            this.geolocation.getCurrentPosition(this.options).then((geo) => {
              let coords = geo.coords.latitude + "," + geo.coords.longitude;
              loading.setContent("Procesando Tarjeta");
              this.restProvider
                  .addFundsWithCard(this.cardId, amount, coords)
                  .pipe(finalize(() => loading.dismiss()))
                  .subscribe((data: any) => {
                    this.navCtrl.setRoot('AccountRechargeApprovedPage', {
                      card: `****${this.cardNumber}`,
                      amount: amountText,
                    });
                  }, err => this.handleError(err));
            }).catch(() => {
              loading.dismiss()
              this.handleError({ status: 404 });
            });
          }
        }
      ]
    });
    alert.present();
  }

  private handleError(err: any) {
    let message: string;

    switch(err.status) {
      case 401:
        message = err.status ? 
          'Error al procesar su solicitud, por favor intente de nuevo...' :
          `Unexpected error: ${err.statusText}`;
        break;

      case 404:
        message = 'Por favor active la ubicación en el dispositivo para continuar...';
        break;

      case 409: default:
        message = 'No hemos podido verificar sus datos, por favor intente de nuevo...'; break;
    }

    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

  public dismiss() {
    this.navCtrl.pop();
  }

}