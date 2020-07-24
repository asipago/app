import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-mobile-recharge-confirm',
  templateUrl: 'mobile-recharge-confirm.html',
})
export class MobileRechargeConfirmPage {
  
  public currencySymbol: string;

	public carrier: string;
	public number: string;
  public amount: number;
  
  public smallScreen: boolean;

  private readonly options: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
  };

  constructor(
  	public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly geolocation: Geolocation,
    private readonly restProvider: RestProvider,
    public dataProvider: DataProvider
  ) {
    this.number = navParams.get('number');
    this.amount = navParams.get('amount');
    this.carrier = navParams.get('carrier').toLowerCase();
    this.smallScreen = platform.height() < 627;
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }
  
  public confirm() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Obteniendo Ubicación'
    });

    loading.present();

    this.geolocation.getCurrentPosition(this.options).then((geo) => {
      let coords = geo.coords.latitude + "," + geo.coords.longitude;
      loading.setContent("Realizando Recarga");
      this.restProvider
          .reloadMobileBalance(this.carrier, this.number, this.amount, coords)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe((response: any) => {
            if(response.status == "Ok") {
              this.navCtrl.setRoot('MobileRechargeApprovedPage', {
                recharge: {
                  amount: this.amount,
                  number: this.number,
                  carrier: this.carrier
                }
              });
            } else {
              this.showToast("No posee fondos suficientes para realizar una recarga");
            }
          }, err => this.showToast("Error al procesar recarga, por favor intente mas tarde..."));
    }).catch((error) => {
      loading.dismiss()
      this.showToast("¡Error al obtener ubicación!");
    });
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
