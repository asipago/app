import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-app-home',
  templateUrl: 'app-home.html',
})
export class AppHomePage {

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public navParams: NavParams
  ) {
    this.menuCtrl.enable(false, 'mainMenu');
  }

  pushPage(page) {
  	this.navCtrl.push(page);
  }

}
