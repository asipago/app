import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { Screenshot } from '@ionic-native/screenshot';
import { SocialSharing } from '@ionic-native/social-sharing';

import { DataProvider } from '@providers/data/data';
import { AuthProvider } from '@providers/auth/auth';

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-send-money-approved',
  templateUrl: 'send-money-approved.html',
})
export class SendMoneyApprovedPage {

  public currencySymbol: string;

  public movement: any;
  public isSharing: boolean;

  public currentAccountName: string;
  public currentAccountType: string;

  @ViewChild('domContent') domContent: ElementRef;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    private screenshot: Screenshot,
    private socialSharing: SocialSharing,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
  ) {
    this.isSharing = false;
    this.movement = navParams.get('movement');
    this.movement.date = this.formatDate(this.movement.date);
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();

    this.authProvider.isOwnerWallet().then(isOwner => {
      if (isOwner) {
        this.currentAccountType = "Cuenta Personal";
        this.currentAccountName = "@" + this.dataProvider.getUserName();
      } else {
        this.currentAccountType = "Cuenta Empresarial";
        this.currentAccountName = this.dataProvider.getCompanyAlias();
      }
    });
  }

  ionViewDidEnter() { }

  shareLink() {
    this.isSharing = true;

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Preparando Imagen'
    });

    loading.present();

    this.screenshot.URI(80).then(res => {
      loading.dismiss();
      this.socialShare(res.URI);
    }, () => {
      const toast = this.toastCtrl.create({
        message: "Error al capturar pantalla",
        duration: 5000,
        position: 'bottom'
      });
      
      loading.dismiss();
      toast.present();
    });
  }

  private socialShare(dataUrl: string) {
    this.socialSharing.share(null, null, dataUrl, null).then(() => {
      this.isSharing = false;
    }, () => {
      this.isSharing = false;

      const toast = this.toastCtrl.create({
        message: "Error al compartir el pago realizado",
        duration: 5000,
        position: 'bottom'
      });

      toast.present();
    });
  }

  goHome() {
    this.navCtrl.setRoot('AccountResumePage');
  }

  private formatDate(value: string) {
    let date = new Date(value);
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
      ((date.getHours() % 12) || 12) + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + (date.getHours() > 11 ? "PM" : "AM");
  }

}
