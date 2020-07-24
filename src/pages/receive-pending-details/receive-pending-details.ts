import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { finalize } from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-receive-pending-details',
  templateUrl: 'receive-pending-details.html',
})
export class ReceivePendingDetailsPage {
  
  public currencySymbol: string;

  public link: any;
  public noBack: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private socialSharing: SocialSharing,
    public dataProvider: DataProvider,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly restProvider: RestProvider,
    private currencyPipe: CurrencyPipe
  ) {
    this.link = this.navParams.get('link');
    this.noBack = this.navParams.get('fromMain');
    this.link.finalAmount = this.getFinalAmount(this.link.amount);
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  shareLink() {
    const message = `${this.dataProvider.getUserRealName()} te esta solicitando ${this.currencyPipe.transform(this.link.amount, this.currencySymbol, 'code', '1.2-2', 'es')}`
    this.socialSharing.shareWithOptions({
      message: message,
      subject: 'Asipago',
      url: 'https://asipago.com/enlace/' + this.link.code,
      chooserTitle: 'Compartir con...'
    });
  }

  viewLink() {
    this.navCtrl.push('ViewLinkPage', {
      code: this.link.code
    });
  }

  goHome() {
    this.navCtrl.setRoot('SendPendingPage');
  }

  removeLink() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Eliminando Enlace...'
    });

    loading.present();

    this.restProvider
        .removeLink(this.link.code)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          if(data.code == this.link.code) {
            this.dismiss();
          } else {
            this.handleError({
              status: 404
            });
          }
        }, err => this.handleError(err));
  }

  dismiss() {
    this.navCtrl.pop();
  }

  private getFinalAmount(amount: number) {
    return amount - ((this.dataProvider.getPercent() * amount) / 100);
  }

  private handleError(error: any) {
    let message: string;
    if (error.status && error.status === 401) {
      message = 'Error al cargar enlace, por favor intente de nuevo...';
    } else if (error.status && error.status === 401) {
      message = 'Error al eliminar enlace, por favor intente nuevamente en unos segundos...';
    } else {
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
