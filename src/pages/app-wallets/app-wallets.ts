import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AuthProvider } from '@providers/auth/auth';
import { DataProvider } from '@providers/data/data';
import { RestProvider } from '@providers/rest/rest';

export interface Company {
  rif: string;
  name: string;
  alias: string;
}

@IonicPage()
@Component({
  selector: 'page-app-wallets',
  templateUrl: 'app-wallets.html',
})
export class AppWalletsPage {

  public wallets: Company[] = [];

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
  	public authProvider: AuthProvider,
    public readonly dataProvider: DataProvider,
    private readonly restProvider: RestProvider
 	) {}

  ionViewDidEnter() {
    this.wallets.length = 0;
    this.restProvider.getWallets().then((data: Company[]) => {
      for (let i = 0; i < data.length; i++) {
        this.wallets.push({
          rif: data[i].rif,
          name: data[i].name,
          alias: data[i].alias
        });
      }
    });
  }

  public switchWallet(value: string) {
    if(value === 'own') {
      this.authProvider.switchWallet(this.dataProvider.getUserDocument());
    } else {
      this.restProvider.findCompanyByDocument(value).subscribe((company: any) => {
        this.dataProvider.setCompany(company);
        this.authProvider.switchWallet(value);
      }, err => this.authProvider.switchWallet(this.dataProvider.getUserDocument()));
    } this.viewCtrl.dismiss();
  }
}
