import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-card-list',
  templateUrl: 'card-list.html',
})
export class CardListPage {
  
  public currencySymbol: string;

  public cards: any = [];
  public availableFunds: number = 0;

  constructor(
  	public navCtrl: NavController,
    public dataProvider: DataProvider,
    private alertCtrl: AlertController,
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

  ionViewDidEnter() { this.loadCards(); }

  loadCards() {
    this.cards.length = 0;

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Cargando...'
    });

    loading.present();

    this.restProvider
        .getCards()
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          for (let i = 0; i < data.length; i++) {
            this.cards.push({
              id: data[i].id,
              number: data[i].last4,
              brand: data[i].brand,
              month: data[i].exp_month,
              year: data[i].exp_year
            });
          }
        }, (err: any) => {
          console.log(err);
          if (err.error.status != "no-cards")
            this.showToast(err.error)
        });
  }

  registerCard() {
    this.navCtrl.push('CardRegisterPage');
  }

  removeCard(card: string) {
    let alert = this.alertCtrl.create({
      title: 'Eliminar Tarjeta',
      message: '<p>Para usarla, deberás registrarla nuevamente, ¿Seguro que quieres continuar?</p>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Continuar',
          handler: () => {
            let loading = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Eliminando...'
            });
        
            loading.present();
        
            this.restProvider
                .removeCard(card)
                .pipe(finalize(() => loading.dismiss()))
                .subscribe(
                  (data: any) => this.loadCards(),
                  err => this.handleError(err.error)
                );
          }
        }
      ]
    });
    alert.present();
  }

  useCard(card: any) {
    this.navCtrl.push('AccountRechargeCardPage', {
      id: card.id,
      number: card.last4,
      brand: card.brand,
      month: card.exp_month,
      year: card.exp_year
    });
  }

  /* hideNumber(cardNumber: string) {
    let trimmedCardNum = cardNumber.replace(/\s+/g, '');

    if (trimmedCardNum.length > 16) {
      trimmedCardNum = trimmedCardNum.substr(0, 16);
    }

    const partitions = trimmedCardNum.startsWith('34') || trimmedCardNum.startsWith('37') 
                       ? [4,6,5] : [4,4,4,4];

    const isAmex = partitions.length == 3;

    const numbers = [];
    let position = 0;
    
    partitions.forEach(partition => {
      const part = trimmedCardNum.substr(position, partition);
      if (part) numbers.push(part);
      position += partition;
    })

    return isAmex ? "*** ****** " + numbers[2] : "**** **** **** " + numbers[3];
  } */

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
