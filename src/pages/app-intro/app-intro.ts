import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams, Slides } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { AuthProvider } from '@providers/auth/auth';

import { TOKEN_NAME, FAIO_NAME } from "@app/config";

@IonicPage()
@Component({
  selector: 'page-app-intro',
  templateUrl: 'app-intro.html',
})
export class AppIntroPage {

  @ViewChild(Slides) slides: Slides;

  public isLoading: boolean = true;

  private readonly skipName: string = "skipIntro";

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public navParams: NavParams,
    public readonly authProvider: AuthProvider,
    public readonly storage: Storage
  ) { }

  async ionViewDidEnter() {
    this.menuCtrl.enable(false, 'mainMenu');

    const faio = await this.storage.get(FAIO_NAME);
    if (!faio) this.storage.set(FAIO_NAME, "disabled");

    const skip = await this.storage.get(this.skipName);
    if (skip === "true") {
      const jwt = await this.storage.get(TOKEN_NAME);
      if (jwt) {
        this.authProvider.autoLogin(jwt);
      } else {
        this.goToHome();
      }
    } else {
      this.isLoading = false;
    }
  }

  public goToHome() {
    this.storage.set(this.skipName, "true").then(() => {
      this.navCtrl.setRoot('AppHomePage');
    });
  }

  public nextSlide() {
    this.slides.slideNext();
  }

  public prevSlide() {
    this.slides.slidePrev();
  }

}