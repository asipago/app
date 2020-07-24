import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SocialSharing } from '@ionic-native/social-sharing';

import { DataProvider } from '@providers/data/data';

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-send-money-approved-link',
  templateUrl: 'send-money-approved-link.html',
})
export class SendMoneyApprovedLinkPage {
  
  public currencySymbol: string;

  public amount: number;
  public finalAmount: number;
  public description: string;
  private code: string;
  public pin: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private socialSharing: SocialSharing,
    public dataProvider: DataProvider
  ) {
    this.amount = navParams.get('amount');
    this.description = navParams.get('description');
    this.code = navParams.get('code');
    this.pin = navParams.get('pin');
    this.finalAmount = navParams.get('finalAmount');
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  shareLink() {
    this.socialSharing.share("https://asipago.com/enlace/" + this.code, null, null, null);
  }

  viewLink() {
    this.navCtrl.push('ViewLinkPage', {
      code: this.code
    });
  }

  goHome() {
    this.navCtrl.setRoot('AccountResumePage');
  }

}
