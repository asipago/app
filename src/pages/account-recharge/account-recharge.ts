import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';

import { BankModel } from '@models/bank-model';

import { AuthProvider } from '@providers/auth/auth';
import { RestProvider } from '@providers/rest/rest';
import { DataProvider } from '@providers/data/data';

import { BANK_LIST } from "@app/config";

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-account-recharge',
  templateUrl: 'account-recharge.html',
})
export class AccountRechargePage {

  public banks: any = [];
  public username: string;

  public currencySymbol: string;
  public isSharing: boolean;

  public availableFunds: number = 0;
  public selectedBank: BankModel;

  public mainForm: FormGroup;
  private walletType: string;

  private accountList: any;
  public accountInfo: {
    code: string;
    type?: string;
    routea?: string;
    routeb?: string;
    zelle?: string;
  };

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    private readonly clipboard: Clipboard,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly authProvider: AuthProvider,
    private readonly restProvider: RestProvider,
    public readonly storage: Storage,
    public dataProvider: DataProvider,
    private formBuilder: FormBuilder
  ) {
    this.isSharing = false;
    this.accountInfo = { type: "", code: "", routea: "", routeb: "", zelle: "" };
    this.mainForm = this.formBuilder.group({
      reference: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(10),
        Validators.maxLength(20),
        Validators.required
      ])),
    });
  }

  ionViewWillEnter() {
    this.banks.length = 0;
    this.isSharing = false;

    this.banks = this.dataProvider.getBanks();
    this.username = this.dataProvider.getUserName();
    this.currencySymbol = this.dataProvider.getCurrencySymbol();

    this.authProvider.isOwnerWallet().then(isOwner => {
      this.walletType = isOwner ? 'Personal' : 'Juridica';
    });

    this.restProvider.getFunds().then(wallet => {
      this.availableFunds = wallet.funds;
    });

    this.storage.get(BANK_LIST).then(bankAccounts => {
      this.accountList = JSON.parse(bankAccounts);
    });
  }

  onSelectChange(selectedValue: any) {
    this.selectedBank = selectedValue;
    this.accountInfo = { type: "", code: "", routea: "", routeb: "", zelle: "" };

    for (let i = 0; i < this.accountList.length; i++) {
      const account = this.accountList[i];
      if (account.bank.alias == this.selectedBank.alias && account.account == this.walletType) {
        switch(this.currencySymbol) {
          case 'BS': default:
            this.accountInfo = {
              code: account.code,
              type: account.type
            }; break;

          case 'USD':
            this.accountInfo = {
              code: account.code,
              routea: account.routea,
              routeb: account.routeb,
              zelle: account.zelle
            }; break;
        } break;
      }
    }
  }

  showAlert() {
    let reference = this.mainForm.value.reference;
    if (reference < 5) {
      this.showToast("Por favor, ingrese un número de referencia válido");
    } else if (this.selectedBank == null) {
      this.showToast("Por favor, seleccione un banco");
    } else {
      let alert = this.alertCtrl.create({
        title: 'Confirmar deposito o transferencia',
        message: '<p>Banco: ' + this.selectedBank.name + '</p><p>Referencia: ' + reference + '</p>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => { }
          },
          {
            text: 'Confirmar',
            handler: () => {
              let bankID = this.selectedBank.id;

              let loading = this.loadingCtrl.create({
                spinner: 'bubbles',
                content: 'Validando Referencia'
              });

              loading.present();

              this.restProvider
                .findTransactionMovement(bankID, reference)
                .pipe(finalize(() => loading.dismiss()))
                .subscribe((data: any) => {
                  this.registerMovement();
                }, err => this.handleError(err));
            }
          }
        ]
      });
      alert.present();
    }
  }

  shareAccount() {
    this.isSharing = true;

    const message = this.currencySymbol == "USD" ?
      `Titular: Asipago Inc.\nCuenta: ${this.accountInfo.code}\nPapel y Electrónico: ${this.accountInfo.routea}\nTransfer por Cable: ${this.accountInfo.routeb}\nZelle: ${this.accountInfo.zelle}` :
      `Titular: Asipago C.A.\nRIF: J-40256036-2\nCuenta ${this.accountInfo.type}\n${this.accountInfo.code}`;  

    this.socialSharing.share(message, "Cuentas Asipago", null, null).then(() => {
      this.isSharing = false;
    }).catch(() => {
      this.isSharing = false;
      const toast = this.toastCtrl.create({
        message: "Error al compartir el pago realizado",
        duration: 5000,
        position: 'bottom'
      });    
      toast.present();
    });
  }

  copyAccount() {
    this.clipboard.copy(this.accountInfo.code.replace(/\D/g, ''));
  }

  private registerMovement() {
    let bankID = this.selectedBank.id;

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Validando Referencia'
    });

    loading.present();

    this.restProvider
      .registerTransactionDeposit(bankID, this.mainForm.value.reference)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe((data: any) => {
        this.navCtrl.setRoot("AccountRechargeApprovedPage", {
          bank: this.selectedBank.name,
          reference: this.mainForm.value.reference
        }); this.mainForm.value.reference = "";
      }, err => this.handleError(err));
  }

  private handleError(error: any) {
    let message: string = (error.status && error.status === 401) ?
      'Nro de referencia ya registrado' : `Unexpected error: ${error.statusText}`;
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