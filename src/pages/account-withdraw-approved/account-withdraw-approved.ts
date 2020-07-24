import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataProvider } from '@providers/data/data';

@IonicPage({
  defaultHistory: ['AccountWithdrawPage']
})
@Component({
  selector: 'page-account-withdraw-approved',
  templateUrl: 'account-withdraw-approved.html',
})
export class AccountWithdrawApprovedPage {
  
  public currencySymbol: string;

  public bank: string;
  public amount: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider
  ) {
    this.bank = navParams.get('bank');
    this.amount = navParams.get('amount');
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  goHome() {
    this.navCtrl.setRoot('AccountResumePage');
  }

}
