import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import { AccountModel as Account } from '@models/account-model';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-account-withdraw-confirm',
  templateUrl: 'account-withdraw-confirm.html',
})
export class AccountWithdrawConfirmPage {
  
  public currencySymbol: string;

	private account: Account;
  public availableFunds: number = 0;

  public mainForm: FormGroup;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    public dataProvider: DataProvider,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly restProvider: RestProvider,
    private formBuilder: FormBuilder
  ) {
  	this.account = this.navParams.get("account");
    this.mainForm = this.formBuilder.group({
      amount: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{1,6}([,|.][0-9]{1,2})?$'),
        Validators.required
      ])),
    });
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
    this.restProvider.getFunds().then(wallet => {
      this.availableFunds = wallet.funds;
    });
  }

  checkTransaction() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando Datos'
    });

    loading.present();

    if(this.mainForm.value.amount == 0) {
      loading.dismiss();
      this.showToast("Por favor ingrese un monto");
    } else if(this.availableFunds < this.mainForm.value.amount) {
      loading.dismiss();
      this.showToast("Solo puede retirar " + this.availableFunds + " Bs.S");
    } else {
      this.restProvider
          .registerTransactionWithdraw(this.account.bank.id, this.mainForm.value.amount, this.account.id)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe((data: any) => {
            this.navCtrl.setRoot("AccountWithdrawApprovedPage", {
              bank: this.account.bank.name,
              amount: this.mainForm.value.amount
            })
          }, err => this.handleError(err));
    }
  }

  private handleError(error: any) {
    let message: string = (error.status && error.status === 401) ?
      'Error al procesar su solicitud, por favor intente de nuevo...' :
      `Unexpected error: ${error.statusText}`;
    this.showToast(message);
  }

  private showToast(message: string) {    
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });    
    toast.present();
  }

}
