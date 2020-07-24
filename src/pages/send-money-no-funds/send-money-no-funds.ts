import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { DataProvider } from '@providers/data/data';

@IonicPage({
  defaultHistory: ['SendMoneyPage']
})
@Component({
  selector: 'page-send-money-no-funds',
  templateUrl: 'send-money-no-funds.html',
})
export class SendMoneyNoFundsPage {
  
  public currencySymbol: string;

  constructor(
  	public navCtrl: NavController,
    public dataProvider: DataProvider
  ) {}

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  public openPage(page: string) {
    this.navCtrl.setRoot(page);
  }

}
