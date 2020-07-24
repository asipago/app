import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { DataProvider } from "@providers/data/data";
import { RestProvider } from '@providers/rest/rest';

import { BANK_LIST } from "@app/config";

@IonicPage()
@Component({
  selector: 'page-app-currency',
  templateUrl: 'app-currency.html',
})
export class AppCurrencyPage {

  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    private readonly loadingCtrl: LoadingController,
    public readonly restProvider: RestProvider,
    public readonly storage: Storage
  ) { }

  async setCurrency(currency: string) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Cargando Moneda'
    });

    loading.present();
    
    this.dataProvider.setCurrency(currency);

    const bankList = await this.restProvider.getBanks().toPromise();
    this.dataProvider.setBanks(bankList);
  
    const bankAccounts = await this.restProvider.getBanksInfo().toPromise();
    await this.storage.set(BANK_LIST, JSON.stringify(bankAccounts));

    this.navCtrl.setRoot('AccountResumePage');

    loading.dismiss();
  }
}
