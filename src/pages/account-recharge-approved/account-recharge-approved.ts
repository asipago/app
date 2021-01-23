import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-account-recharge-approved',
  templateUrl: 'account-recharge-approved.html',
})
export class AccountRechargeApprovedPage {

  public bank: string;
  public reference: string;

  public card: string;
  public amount: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.bank = navParams.get('bank');
    this.reference = navParams.get('reference');
    
    this.card = navParams.get('card');
    this.amount = navParams.get('amount');
  }

  goHome() {
    this.navCtrl.setRoot('AccountResumePage');
  }

}
