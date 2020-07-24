import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataProvider } from '@providers/data/data';

@IonicPage({
  defaultHistory: ['MobileRechargePage']
})
@Component({
  selector: 'page-mobile-recharge-approved',
  templateUrl: 'mobile-recharge-approved.html',
})
export class MobileRechargeApprovedPage {
  
  public currencySymbol: string;

	public recharge: any;

  constructor(
  	public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider
  ) {
    this.recharge = navParams.get('recharge');
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  goHome() {
    this.navCtrl.setRoot('AccountResumePage');
  }

}
