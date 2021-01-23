import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import { BankModel as Bank } from '@models/bank-model';

import { DataProvider } from '@providers/data/data';
import { RestProvider } from '@providers/rest/rest';

@IonicPage({
  defaultHistory: ['AccountRechargePage']
})
@Component({
  selector: 'page-account-register-bank',
  templateUrl: 'account-register-bank.html',
})
export class AccountRegisterBankPage {

  public banks: any = [];
  public selectedBank: Bank;

  public mainForm: FormGroup;
  public currentCurrency: string;

  constructor(
  	public navCtrl: NavController,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly restProvider: RestProvider,
    public dataProvider: DataProvider,
  	private formBuilder: FormBuilder,
  	public viewCtrl : ViewController
  ) {
    this.currentCurrency = "";
    this.mainForm = this.formBuilder.group({
      routing:  new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{9}?$'),
        Validators.required
      ])),
      account:  new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{12,20}?$'),
        Validators.required
      ])),
      type: ['', Validators.required],
      email: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9]+$')
      ])),
    });
  }

  ionViewDidEnter() {
    this.banks.length = 0;
    this.banks = this.dataProvider.getBanks();
    this.currentCurrency = this.dataProvider.getCurrency();
  }

  onSelectChange(selectedValue: any) {
    this.selectedBank = selectedValue;
  }

  registerAccount() {
    if (this.currentCurrency == "USD") {
      this.createAccount();
    } else {
      if(this.mainForm.value.account.startsWith(this.selectedBank.code)) {
        this.createAccount();
      } else {
        this.showToast("Número de cuenta incorrecto");
      }
    }
  }

  private createAccount() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando Datos'
    });

    loading.present();

    this.restProvider
        .registerBankAccount(
          this.selectedBank.id,
          this.mainForm.value.routing,
          this.mainForm.value.account,
          this.selectedBank.code,
          this.mainForm.value.type,
          this.mainForm.value.email
        )
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          this.viewCtrl.dismiss();
        }, err => this.handleError(err));
  }

  private handleError(error: any) {
    let message: string = (error.status && error.status === 401) ? 
      'Error al procesar su solicitud ... Por favor, ¡Intente nuevamente en unos segundos!' :
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
