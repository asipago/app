import { Component } from '@angular/core';
import { IonicPage, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

import { IMAGE_URL } from "@app/config";

@IonicPage()
@Component({
  selector: 'page-movements-pending',
  templateUrl: 'movements-pending.html',
})
export class MovementsPendingPage {
  
  public currencySymbol: string;

	public links: any = [];

	constructor(
    public modalCtrl: ModalController,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly restProvider: RestProvider,
    public dataProvider: DataProvider
	) {}

  ionViewDidEnter() {
    this.loadLinks();
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  private loadLinks() {
    this.links.length = 0;

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Cargando...'
    });

    loading.present();

    this.restProvider
        .getLinksPendingPayment()
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          for (let i = 0; i < data.length; i++) {
            this.links.push({
              code: data[i].code,
              createdAt: data[i].createdAt,
              amount: data[i].amount,
              concept: data[i].concept,
              secure: data[i].secure,
              avatar: `${IMAGE_URL}/${data[i].user_gen}`
            });
          }
        }, err => this.handleError(err));
  }

  public viewLink(selectedLink) {
    let modal = this.modalCtrl.create('SendPendingDetailsPage', { link: selectedLink });
        modal.onDidDismiss(() => { this.loadLinks(); });
        modal.present();
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
