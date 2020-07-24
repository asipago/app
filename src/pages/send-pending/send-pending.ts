import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-send-pending',
  templateUrl: 'send-pending.html',
})
export class SendPendingPage {
  
  public currencySymbol: string;

  public links: any = [];

  constructor(
    public navCtrl: NavController,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public readonly restProvider: RestProvider,
    public dataProvider: DataProvider
  ) {}

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  ionViewDidEnter() { this.loadLinks(); }

  loadLinks() {
    this.links.length = 0;

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Cargando...'
    });

    loading.present();

    this.restProvider
        .getLinksPendingPayment()
        .subscribe((data: any) => {

          for (let i = 0; i < data.length; i++) {
            this.links.push({
              code: data[i].code,
              createdAt: data[i].createdAt,
              amount: data[i].amount,
              concept: data[i].concept,
              secure: data[i].secure,
              pin: "",
              owner: false
            });
          }

          this.restProvider
              .getLinksPendingSend()
              .pipe(finalize(() => loading.dismiss()))
              .subscribe((data: any) => {
                for (let i = 0; i < data.length; i++) {
                  this.links.push({
                    code: data[i].code,
                    createdAt: data[i].createdAt,
                    amount: data[i].amount,
                    concept: data[i].concept,
                    secure: data[i].secure,
                    pin: data[i].secure ? data[i].pin : "-",
                    owner: true
                  });
                }
              }, err => this.handleError(err));

        }, err => {
          loading.dismiss();
          this.handleError(err)
        });
  }

  viewDetails(selectedLink) {
    this.navCtrl.push('SendPendingDetailsPage', {
      link: selectedLink
    });
  }

  private handleError(error: any) {
    let message: string;
    if (error.status && error.status === 401) {
      message = 'Error al cargar enlaces, por favor intente de nuevo...';
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