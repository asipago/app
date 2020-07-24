import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ModalController, ToastController, LoadingController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

import { animateToLeft, animateScrollButton } from '@app/animations';

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
	selector: 'page-movements',
	templateUrl: 'movements.html',
  animations: [animateToLeft, animateScrollButton]
})
export class MovementsPage {

  @ViewChild(Content) content: Content;
  
  public currencySymbol: string;

	public totalAmount: number;
  public selectedFilter: string;

	public filter: string;

	private details: any = {};
	private movements: any = [];

  public selectedDate: string;
  public showScrollButton: boolean;

  public calendars = [];

	constructor(
		public navParams: NavParams,
		public navCtrl: NavController,
    public modalCtrl: ModalController,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public readonly restProvider: RestProvider,
    public dataProvider: DataProvider,
    private changeDetectorRef: ChangeDetectorRef
	) {}

  ionViewWillEnter() {
    this.filter = "all";
    this.selectedFilter = "TODOS";
    this.showScrollButton = false;
    this.selectedDate = new Date().toISOString();
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
	}

  ionViewDidEnter() {
    this.loadMovements();
    this.content.ionScroll.subscribe((event) => {
      this.showScrollButton = event.scrollTop > 180;
      this.changeDetectorRef.detectChanges();
    });
  }

  /* private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  } */

  private loadMovements() {
    this.details = {};
    this.movements.length = 0;

    let dateIni = this.prepareDate(this.selectedDate),
        dateEnd = this.prepareDate(this.selectedDate);

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Cargando...'
    });

    loading.present();

    this.restProvider
        .getMovements(dateIni, dateEnd)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          for (let i = 0; i < data.length; i++) {
            /*let percentMovement = ((data[i].amount_movement * (data[i].amount_percentage == 0 ? 1 : data[i].amount_percentage)) / 100);

            let finalMovement = (data[i].type == "IN") ?
              data[i].amount_movement + percentMovement:
              data[i].amount_movement - percentMovement;*/
            if(data[i].recharge) {
              this.details[i] = {
                reference: data[i].reference,
                date: this.formatDate(data[i].createdAt),
                amount: data[i].amount,
                percentage: "-",
                totalAmount: data[i].amount,
                concept: "NUMERO: " + data[i].number,
                location: data[i].location,
                user: {
                  name: data[i].number,
                  username: "RECARGA",
                  document: data[i].carrier
                }
              };
            } else {
              const finalMovement = data[i].amount_movement - (data[i].movement.percentage == 0 ? 0 : (data[i].movement.amount * data[i].movement.percentage) / 100);

              this.details[i] = {
                reference: data[i].movement.reference,
                date: this.formatDate(data[i].movement.createdAt),
                amount: data[i].movement.amount,
                percentage: data[i].movement.percentage == 0 ? "-" : data[i].movement.percentage + "%",
                totalAmount: finalMovement,
                concept: data[i].movement.concept == "" ? "-" : data[i].movement.concept,
                location: data[i].movement.location,
                user: data[i].to_user.rif ? {
                  name: data[i].to_user.name,
                  username: data[i].to_user.alias,
                  document: data[i].to_user.rif
                } : {
                  name: data[i].to_user.firstname + ' ' + data[i].to_user.lastname,
                  username: data[i].to_user.username,
                  document: data[i].to_user.nationality + '-' + data[i].to_user.document
                }
              };
            }

            this.movements.push({
              reference: i,
              date: this.details[i].date,
              user: this.details[i].user.username,
              amount: this.details[i].amount,
              concept: this.details[i].concept,
              type: data[i].type
            });

            this.setTotalAmount("ALL");
          }
        }, err => this.handleError(err));
  }

	public viewDetails(reference) {
    let modal = this.modalCtrl.create('MovementsDetailsPage', { movement: this.details[reference] });
				modal.present();
  }

  public selectFilter(event?: any) {
  	//this.setTotalAmount(event.value.toUpperCase());
    this.selectedFilter = this.filter == 'all' ? 'TODOS' : (this.filter == 'out' ? 'ENVIADOS' : 'RECIBIDOS');
  }

  public selectDate(event) {
    this.loadMovements();
  }

  public goTop() {
    this.content.scrollToTop();
  }

  private setTotalAmount(type: string) {
    let totalAmount = 0;
    for(let values of this.movements) {
      if(type == "ALL" && values.type == "IN")
        totalAmount += +values.amount;
      else if(type == "ALL" && values.type == "OUT")
        totalAmount += -values.amount;
      else if(values.type == type)
        totalAmount += +values.amount;
    } this.totalAmount = totalAmount;
  }

  private formatDate(value: string) {
    let date = new Date(value),
        d = date.getDate(),
        m = date.getMonth() + 1;
    return (d < 10 ? '0' + d : d) + "/" + (m < 10 ? '0' + m : m) + "/" + date.getFullYear() + " " +
      ((date.getHours() % 12) || 12) + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + (date.getHours() > 11 ? "PM" : "AM");
  }

  private prepareDate(value: string) {
    let date = value.slice(0,10).split("-");
    return date[1] + "/" + date[2] + "/" + date[0];
  }

  private handleError(error: any) {
    let message: string;
    if (error.status && error.status === 401) {
      message = 'Error al cargar movimientos, por favor intente de nuevo...';
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