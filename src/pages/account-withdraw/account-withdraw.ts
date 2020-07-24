import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-account-withdraw',
  templateUrl: 'account-withdraw.html',
})
export class AccountWithdrawPage {
  
  public currencySymbol: string;

  public accounts: any = [];
  public availableFunds: number = 0;

  constructor(
  	public navCtrl: NavController,
    public dataProvider: DataProvider,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly restProvider: RestProvider,
  ) {}

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
    this.restProvider.getFunds().then(wallet => {
      this.availableFunds = wallet.funds;
    });
  }

  ionViewDidEnter() { this.loadBankAccounts(); }

  loadBankAccounts() {
    this.accounts.length = 0;

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Cargando...'
    });

    loading.present();

    this.restProvider
        .getBankAccounts()
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          for (let i = 0; i < data.length; i++) {
            this.accounts.push({
              id: data[i].id,
              code: data[i].code,
              type: data[i].type == "S" ? 'Ahorro' : 'Corriente',
              verified: data[i].verified,
              bank: this.dataProvider.getBank(data[i].bank)
            });
          }
        }, err => this.showToast("Error al cargar sus cuentas, por favor intente de nuevo..."));
  }

  registerAccount() {
    this.navCtrl.push('AccountRegisterBankPage');
  }

  removeAccount(account: string) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Eliminando...'
    });

    loading.present();

    this.restProvider
        .removeBankAccount(account)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          this.loadBankAccounts();
        }, err => this.handleError(err));
  }

  continueWithdraw(i: number) {
    let theAccount = this.accounts[i];
    if(theAccount.verified) {
      this.navCtrl.push('AccountWithdrawConfirmPage', {
        account: theAccount
      });
    } else {
      this.showToast("No puede retirar fondos de una cuenta sin verificar");
    }
  }

  private handleError(error: any) {
    let message: string = (error.status && error.status === 401) ?
      'Error al procesar su solicitud, por favor intente de nuevo...' :
      `Unexpected error: ${error.statusText}`;
    this.showToast(message);
  }

  private showToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

}
