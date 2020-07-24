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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.bank = navParams.get('bank');
    this.reference = navParams.get('reference');
  }

  goHome() {
    this.navCtrl.setRoot('AccountResumePage');
  }

}
