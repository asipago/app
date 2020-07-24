import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

@IonicPage({
  defaultHistory: ['ReceiveMoneyPage']
})
@Component({
  selector: 'page-receive-money-confirm',
  templateUrl: 'receive-money-confirm.html',
})
export class ReceiveMoneyConfirmPage {
  
  public currencySymbol: string;

  public availableFunds: number = 0;

  public username: string;
  public amount: number;
  public finalAmount: number;
  public description: string;
  public secure: boolean;

  public toUser: string;
  public isLink: boolean;

  public userType: string;
  public userDocument: string;

  public isCompany: boolean;

  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly restProvider: RestProvider,
    public navParams: NavParams
  ) {
    this.username = navParams.get('username');
    this.amount = navParams.get('amount');
    this.description = navParams.get('description');
    this.secure = navParams.get('secure');

    this.toUser = navParams.get('userID');
    this.isLink = navParams.get('isLink');
    this.isCompany = navParams.get('isCompany');

    this.finalAmount = this.getFinalAmount(this.amount);
    this.restProvider.getFunds().then(wallet => {
      this.availableFunds = wallet.funds;
    });

    this.userType = navParams.get('userType');
    this.userDocument = navParams.get('userDocument');
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  confirm() {

    let httpRequest;

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando Datos'
    });

    loading.present();

    if(this.isLink) {
      httpRequest = this.restProvider.generateReceiveLink(this.amount, this.secure, this.description)
    } else {
      httpRequest = this.restProvider.generateReceiveLink(this.amount, true, this.description, this.toUser)
    }

    httpRequest
      .pipe(finalize(() => loading.dismiss()))
      .subscribe((data: any) => {
        this.navCtrl.setRoot('ReceiveMoneyApprovedPage', {
          username: this.username,
          amount: this.amount,
          pin: this.secure ? data.pin : '-',
          code: data.code,
          description: this.description,
          isLink: this.isLink,
          finalAmount: this.getFinalAmount(data.amount),
        });
      }, err => this.handleError(err));
  }

  private getFinalAmount(amount: number) {
    return amount - ((this.dataProvider.getPercent() * amount) / 100);
  }

  private handleError(error: any) {
    let message: string;
    if (error.status && error.status === 401) {
      message = 'Error al generar cuenta por cobrar, por favor intente de nuevo...';
    }
    else {
      message = `Unexpected error: ${error.statusText}`;
    }

    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }
}
