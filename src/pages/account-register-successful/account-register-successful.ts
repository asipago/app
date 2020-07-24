import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  defaultHistory: ['AccountLoginPage']
})
@Component({
  selector: 'page-account-register-successful',
  templateUrl: 'account-register-successful.html',
})
export class AccountRegisterSuccessfulPage {

  private username: string;

  constructor(
    public navCtrl: NavController,
    public readonly navParams: NavParams
  ) {
    this.username = this.navParams.get('username');
  }

  goHome() { this.navCtrl.setRoot('AccountLoginPage'); }

  showSmsValidation() {
    this.navCtrl.push("AccountRegisterVerifyPage", {
      username: this.username
    });
  }

}
