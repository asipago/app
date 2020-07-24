import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { DataProvider } from '@providers/data/data';

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-receive-money-approved',
  templateUrl: 'receive-money-approved.html',
})
export class ReceiveMoneyApprovedPage {
  
  public currencySymbol: string;

  public username: string;
  public amount: number;
  public finalAmount: number;
  public description: string;
  public pin: string;

  private code: string;
  public isLink: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private socialSharing: SocialSharing,
    public dataProvider: DataProvider
  ) {
    this.amount = navParams.get('amount');
    this.code = navParams.get('code');
    this.pin = navParams.get('pin');
    
    this.username = navParams.get('username');
    this.description = navParams.get('description');

    this.finalAmount = navParams.get('finalAmount');
    this.isLink = navParams.get('isLink');
  }
  
  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }
//Hola usted tiene una cuenta por pagar de @fulano por tanto
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
