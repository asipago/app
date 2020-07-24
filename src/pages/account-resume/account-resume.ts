import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController, ModalController, ToastController, Platform } from 'ionic-angular';

import * as HighCharts from 'highcharts';

import { DataProvider } from "@providers/data/data";
import { RestProvider } from "@providers/rest/rest";
import { AuthProvider } from "@providers/auth/auth";

@IonicPage({
  defaultHistory: ['AccountLoginPage']
})
@Component({
  selector: 'page-account-resume',
  templateUrl: 'account-resume.html',
})
export class AccountResumePage {

  @ViewChild('chartTarget') chartTarget: ElementRef;
  
  public currencySymbol: string;

  public notify: boolean = true;
  public bigScreen: boolean = true;

  public funds: number = 0;
  public withheld: number = 0;
  
  public chartEl: any;
  private chartConf: Highcharts.Options;

  public userWallet: boolean;
  public accountName: string;

  public showTitle: boolean;

  constructor(
    private readonly navCtrl: NavController,
    private readonly toastCtrl: ToastController,
    private readonly restProvider: RestProvider,
    public modalCtrl: ModalController,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public menuCtrl: MenuController,
    public platform: Platform
  ) {
    //this.configChar();
    this.showTitle = true;
    this.userWallet = true;
    this.platform.ready().then((readySource) => {
      this.bigScreen = platform.height() > 626;
    });
  }

  private configChar() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();

    this.chartConf = {
      chart: {
        type: 'spline',
        margin: [15, 0, 15, 0],
        showAxes: false,
        spacing: [5, 0, 5, 0],
        plotBorderWidth: 0,
        backgroundColor:'rgba(255, 255, 255, 0.0)'
      },
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      title: {
        text: ''
      },
      pane: {
        size: '100%'
      },
      xAxis: {
        categories: this.LastDays(5, 'weekday'),
        gridLineColor: '#fff',
        tickLength: 0,
        lineWidth: 0,
        margin: 0,
        min: 1,
        max: 5,
        //offset: -40,
        labels: {
          enabled: false,
          style: {
            color: "#fff",
            position: "absolute",
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }
        }
      },
      yAxis: {
        visible: false,
        margin: 0
      },
      tooltip: {
        pointFormat: "{point.y:,.2f} " + this.currencySymbol,
        crosshairs: true,
        shared: true
      },
      plotOptions: {
        spline: {
          lineWidth: 4,
          marker: {
            radius: 6,
            lineColor: '#098bf9',
            lineWidth: 1
          }
        },
        series: {
          clip: false
        }
      },
      series: [{
        name: '',
        type: 'spline',
        color: '#fff',
        marker: {
          symbol: 'circle'
        },
        data: [0, 0, 0, 0, 0, 0, 0]
      }]
    };
  }

  ionViewDidLoad() {
    this.configChar();
    HighCharts.setOptions({ lang: { decimalPoint: ',', thousandsSep: '.' } });
    this.chartEl = HighCharts.chart(this.chartTarget.nativeElement, this.chartConf);
  }

  ionViewWillEnter() {
    this.restProvider
      .getLinksPendingPayment()
        .subscribe((data: any) => {
          this.notify = data.length > 0;
        }, err => this.handleError(err));

    this.restProvider
        .getFunds()
        .then((data: any) => {
          this.funds = data.funds;
          this.withheld = data.withheld;
        }, err => this.handleError(err));

    this.restProvider
      .getMovementsAverage(5)
        .subscribe((data: any) => {
          let newData: number[] = [];
          for (var i = 0; i < data.length; ++i) {
            newData.push(data[i].in - data[i].out);
          }
          newData.push(0);
          newData.unshift(0);
          this.chartEl.series[0].update({ data: newData }, true);
          window.dispatchEvent(new Event('resize'));
        }, err => this.handleError(err));
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'mainMenu');
    this.authProvider.isOwnerWallet().then(isOwner => this.userWallet = isOwner);
    this.accountName = this.userWallet ? 'Cuenta Personal' : this.dataProvider.getCompanyAlias();
    HighCharts.setOptions({ lang: { decimalPoint: ',', thousandsSep: '.' } });
  }

  viewPending() {
    this.navCtrl.push('MovementsPendingPage');
  }

  openPage(page: any, push?: boolean) {
    if(push) this.navCtrl.push(page);
  	else this.navCtrl.setRoot(page);
  }

  /* private formatDate(value: string) {
    let date = new Date(value);
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
      ((date.getHours() % 12) || 12) + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + (date.getHours() > 11 ? "PM" : "AM");
  } */

  private handleError(error: any) {
    let message: string;
    if (error.status && error.status === 401) {
      message = 'Error al cargar saldos, por favor intente de nuevo...';
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

  private LastDays (n:number, option?: string) {
    let arr = Array.apply(0, Array(n)).map(function(v,i){return i}),
        weekday = new Array(7);
        
    weekday[0] = "Domingo";
    weekday[1] = "Lunes";
    weekday[2] = "Martes";
    weekday[3] = "Miercoles";
    weekday[4] = "Jueves";
    weekday[5] = "Viernes";
    weekday[6] = "Sabado";
    
    return [""].concat(arr.map(function(n) {
      let date = new Date();
      date.setDate(date.getDate() - n);
      return (function(day, month, year, weekendDay) {
        switch(option) {
          case 'weekday': return weekday[weekendDay];
          default: return [day<10 ? '0'+day : day, month<10 ? '0'+month : month, year].join('/');
        }
      })(date.getDate(), date.getMonth(), date.getFullYear(), date.getDay());
    }).slice().reverse());
  }
}
