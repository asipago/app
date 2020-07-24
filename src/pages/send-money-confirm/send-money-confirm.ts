import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

@IonicPage({
  defaultHistory: ['SendMoneyPage']
})
@Component({
  selector: 'page-send-money-confirm',
  templateUrl: 'send-money-confirm.html',
})
export class SendMoneyConfirmPage {
  
  public currencySymbol: string;

  public availableFunds: number = 0;

  public username: string;
  public amount: number;
  public finalAmount: number;
  public description: string;
  public secure: boolean = true;
  public pin: string;

  public isLink: boolean = false;

  public userType: string;
  public userDocument: string;

  public isCompany: boolean;

  private readonly options: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
  };

  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public modalCtrl: ModalController,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly geolocation: Geolocation,
    private readonly restProvider: RestProvider,
    public navParams: NavParams
  ) {
    this.username = navParams.get('username');
    this.amount = navParams.get('amount');
    this.description = navParams.get('description');
    this.secure = navParams.get('secure');
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
    if(this.dataProvider.getSettings().check_transaction_pin) {
      let pinModal = this.modalCtrl.create('AppConfirmPinPage');
          pinModal.onDidDismiss(pin => {
            if(pin.length == 6)
              this.confirmTransaction(pin);
          });
          pinModal.present();
    } else {
      this.confirmTransaction();
    }
  }

  private confirmTransaction(pin?: string) {

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Obteniendo Ubicación'
    });

    loading.present();

    if(this.availableFunds >= this.amount) {
      if(this.isLink) {
        this.restProvider
            .generateSendLink(this.amount, this.secure, this.description, pin)
            .pipe(finalize(() => loading.dismiss()))
            .subscribe((data: any) => {
              this.navCtrl.setRoot('SendMoneyApprovedLinkPage', {
                amount: data.amount,
                description: this.description,
                pin: this.secure ? data.pin : '-',
                code: data.code,
                finalAmount: this.getFinalAmount(data.amount)
              });
            }, err => this.handleError(err));
      } else {
        this.geolocation.getCurrentPosition(this.options).then((geo) => {
          let coords = geo.coords.latitude + "," + geo.coords.longitude;
          loading.setContent("Verificando Datos");
          this.restProvider
              .generateSendMovement(this.amount, this.userType, this.userDocument, this.description, coords, pin)
              .pipe(finalize(() => loading.dismiss()))
              .subscribe((data: any) => {
                this.navCtrl.setRoot('SendMoneyApprovedPage', {
                  movement: {
                    reference: data.movement.reference,
                    date: data.movement.date,
                    amount: data.movement.amount,
                    percentage: data.movement.percentage,
                    finalAmount: this.getFinalAmount(data.movement.amount),
                    concept: data.movement.concept || "",
                    location: coords,
                    user: {
                      name: data.user.name,
                      username: this.username,
                      document: data.user.document
                    }
                  }
                });
              }, err => this.handleError(err));
        }).catch(() => {
          loading.dismiss()
          this.handleError({ status: 404 });
        });
      }
  	} else {
      loading.dismiss();
    	this.navCtrl.setRoot('SendMoneyNoFundsPage');
  	}
  }

  private getFinalAmount(amount: number) {
    return amount - ((this.dataProvider.getPercent() * amount) / 100);
  }

  private handleError(err: any) {
    let message: string;

    switch(err.status) {
      case 401:
        message = err.error.err == "no bank account verified" ? 
          'Necesitas tener una cuenta bancaria verificada para enviar ' + err.error.currency :
          'Error al generar enlace, por favor intente de nuevo...';
        break;

      case 404:
        message = 'Por favor active la ubicación en el dispositivo para continuar...';
        break;

      case 409: default:
        message = 'PIN incorrecto'; break;
    }

    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

}
