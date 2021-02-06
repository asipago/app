import { Component, ViewChild } from '@angular/core';
import { App, Platform, Nav, AlertController, ToastController } from 'ionic-angular';

import { Deeplinks } from '@ionic-native/deeplinks';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';

import { AuthProvider } from '@providers/auth/auth';
import { RestProvider } from '@providers/rest/rest';
import { DataProvider } from '@providers/data/data';
import { FcmProvider } from '@providers/fcm/fcm';

import { SERVER_URL, PROFILE_NAME } from "@app/config";
import { animateToRight, animateToLeft, expandAnimation } from '@app/animations';

export interface Company {
  rif: string;
  name: string;
  alias: string;
  url: string;
}

@Component({
  templateUrl: 'app.html',
  animations: [animateToLeft, animateToRight, expandAnimation]
})
export class MyApp {

  rootPage: any = 'AppIntroPage';
  rootPageParams: any = {};

  currentCurrency: string;

  // private activePage: any;
  private firstLoad: boolean = true;
  private dialogSessionOpened: boolean = false;

  public showSubmenuA: boolean = false;
  public showSubmenuB: boolean = false;
  public showSubmenuC: boolean = false;

  public imageURL: string;
  public username: string;
  public shortname: string;

  public ownerUsername: string;
  public ownerShortname: string;
  public ownerImageURL: string;

  public userWallet: boolean = true;
  public listWallets: boolean = false;
  public loadingWallets: boolean = true;

  public today: Date = new Date();
  public wallets: Company[] = [];

  public linksCount: { send: number, receive: number } = {
    send: 0, receive: 0
  }

  @ViewChild(Nav) nav: Nav;

  constructor(
    public app: App,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private readonly deeplinks: Deeplinks,
    // private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly alertCtrl: AlertController,
    public readonly authProvider: AuthProvider,
    public readonly restProvider: RestProvider,
    public dataProvider: DataProvider,
    public storage: Storage,
    public fcm: FcmProvider
  ) {
    this.wallets.length = 0;
    this.currentCurrency = this.dataProvider.getCurrency();

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#333333");
      this.statusBar.styleLightContent();

      this.fcm.getToken();
      this.fcm.eventListener.subscribe(object => {
        if (object.tap) {
          let page: string;
          switch (object.type) {
            case "send_money": case "process_link":
              page = "MovementsPage";
              break;

            case "send_payment":
              page = "MovementsPendingPage";
              break;
          }
          this.nav.setRoot(page);
        } else {
          const toast = this.toastCtrl.create({
            message: object.body,
            duration: 3000
          });
          toast.present();
        }
      });

      this.authProvider.authUser.subscribe(event => {
        //console.log(event);
        switch (event) {
          case "invalid-token": case "token-expired": case "logout":
            if (!this.firstLoad)
              this.rootPage = 'AccountLoginPage';
            break;

          case 'not-assigned':
            this.rootPage = 'AppDeviceUnassignedPage';
            this.authProvider.authUser.unsubscribe();
            break;

          case 'not-allowed':
            this.rootPage = 'AppDeviceUnallowedPage';
            this.authProvider.authUser.unsubscribe();
            break;

          case 'not-verified':
            this.rootPage = 'AppDeviceUnverifiedPage';
            break;

          case "login-ok":
            this.showWallets(true);
            this.updateMenuValues();
            this.rootPage = 'AccountResumePage';
            break;

          case "check-device":
            this.authProvider.checkDevice();
            break;

          case 'update-profile':
            this.updateMenuValues();
            break;

          /* case "switch-wallet":
            this.userWallet = this.dataProvider.getUserDocument() === this.restProvider.current_document;
            this.updateMenuValues();
            this.nav.setRoot('AccountResumePage');
            break; */

          default:
            // NOT IMPLEMENTED YET: device-ok
            break;
        }
        this.firstLoad = false;
      });

      this.authProvider.sessionEvent.subscribe(value => {
        if (value && !this.dialogSessionOpened) {
          this.dialogSessionOpened = true;
          const sessionDialog = this.alertCtrl.create({
            title: 'La sesión pronto se cerrará',
            message: '¿Quieres mantener la sesión activa?',
            buttons: [{
              text: 'Cerrar Sesión',
              handler: () => {
                this.authProvider.logout();
              }
            }, {
              text: 'Continuar',
              handler: () => {
                this.dialogSessionOpened = false;
                this.authProvider.refresh();
              }
            }]
          });
          sessionDialog.present();
        }
      });

      this.deeplinks.route({
        '/enlace/:code': 'ViewLinkConfirmPage',
        '/validar/:type/:token': 'AppConfirmTokenPage'
      }).subscribe(match => {
        /* console.log("ok");
        console.log(match); */
        this.nav.setRoot(match.$route, match.$args);
      }, nomatch => {
        /* console.log("fail");
        console.log(nomatch); */
      });

      this.platform.registerBackButtonAction(() => {
        const nav = this.app.getActiveNavs()[0];
        const activeView = nav.getActive();
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          switch (activeView.name) {
            case 'AccountResumePage': default:
              const alert = this.alertCtrl.create({
                title: 'Cerrar asipago',
                message: '¿Quieres cerrar sesión y salir?',
                buttons: [{
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => { }
                }, {
                  text: 'Salir',
                  handler: () => {
                    this.exit();
                    this.platform.exitApp();
                  }
                }]
              });
              alert.present();
              break;

            case 'AccountPage':
            case 'AccountRechargePage':
            case 'AccountWithdrawPage':
            case 'AccountWithdrawApprovedPage':
            case 'AppSettingsPage':
            case 'MobileRechargePage':
            case 'MobileRechargeApprovedPage':
            case 'MovementsPage':
            case 'ReceiveMoneyPage':
            case 'ReceiveMoneyApprovedPage':
            case 'ReceivePendingPage':
            case 'SendMoneyPage':
            case 'SendMoneyNoFundsPage':
            case 'SendMoneyApprovedPage':
            case 'SendMoneyApprovedLinkPage':
            case 'SendPendingPage':
              this.nav.setRoot('AccountResumePage');
              break;
          }
        }
      });

      // loading.dismiss();
      splashScreen.hide();
    });
  }

  public async showWallets(background?: boolean) {
    this.wallets.length = 0;

    this.loadingWallets = true;
    this.listWallets = !background;

    /* for(let i = 0; i < 5; i++) {
      this.wallets.push({
        rif: "J-123456-" + i,
        name: "EMPRESA " + i,
        alias: "EMPRESA " + i,
        url: `${SERVER_URL}/avatar/company/J-123456-"${i}`
      }); await this.delay(300);
    } this.loadingWallets = false; */

    this.restProvider.getWallets().then(async (data: Company[]) => {
      for (let i = 0; i < data.length; i++) {
        await this.delay(300);
        this.wallets.push({
          rif: data[i].rif,
          name: data[i].name,
          alias: data[i].alias,
          url: `${SERVER_URL}/company/${data[i].rif.toUpperCase()}`
        });
      } this.loadingWallets = false;
    });
  }

  public hideWallets() { this.listWallets = false; }

  public switchWallet(value: string) {
    if (value === 'own') {
      this.authProvider.switchWallet(this.dataProvider.getUserDocument());
      this.switchWalletEvent(true)
    } else {
      this.authProvider.switchWallet(value);
      this.restProvider.findCompanyByDocument(value).subscribe((company: any) => {
        this.dataProvider.setCompany(company);
        this.switchWalletEvent(false)
      }, err => this.switchWalletEvent(true));
    }
  }

  private switchWalletEvent(isOwner: boolean) {
    this.userWallet = isOwner;
    this.updateMenuValues();
    this.nav.setRoot('AccountResumePage');
  }

  menuHandler(menu) {
    switch (menu) {
      case 0: this.showSubmenuA = !this.showSubmenuA; break;
      case 1: this.showSubmenuB = !this.showSubmenuB; break;
      case 2: this.showSubmenuC = !this.showSubmenuC; break;
    }
  }

  openPage(page) {
    //if(this.activePage != page) {
    this.nav.setRoot(page);
    this.updateMenuValues();
    this.authProvider.checkDevice();
    //this.activePage = page;
    //}
  }

  exit() {
    this.authProvider.logout()
  }

  private async updateMenuValues() {
    this.ownerUsername = "@" + this.dataProvider.getUserName();
    this.ownerShortname = this.dataProvider.getUserShortName();
    this.ownerImageURL = await this.storage.get(`${PROFILE_NAME}`);

    if (!this.ownerImageURL) {
      this.ownerImageURL = `${SERVER_URL}/${this.dataProvider.getUserImage()}?` + new Date().getTime();
    };

    if (this.userWallet) {
      this.username = this.ownerUsername;
      this.shortname = this.ownerShortname;
      this.imageURL = this.ownerImageURL;
      this.restProvider
        .getLinksCount()
        .subscribe((data: any) => {
          this.linksCount.send = data.pending_send;
          this.linksCount.receive = data.pending_receive;
        }, err => { /* NOT IMPLEMENTED YET */ });
    } else {
      this.username = this.dataProvider.getCompanyRif();
      this.shortname = this.dataProvider.getCompanyAlias();
      this.imageURL = `${SERVER_URL}/company/${this.dataProvider.getCompanyRif().toUpperCase()}`;
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}