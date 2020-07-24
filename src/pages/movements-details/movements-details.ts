import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

import { DataProvider } from '@providers/data/data';

@IonicPage()
@Component({
  selector: 'page-movements-details',
  templateUrl: 'movements-details.html',
})
export class MovementsDetailsPage {
  
  public currencySymbol: string;

  public movement: any;
  public appInstalled: boolean = false;

  private readonly locationOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
  };

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl : ViewController,
    private launchNavigator: LaunchNavigator,
    private readonly geolocation: Geolocation,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public dataProvider: DataProvider
  ) {
    this.movement = this.navParams.get('movement');
  }

  ionViewDidLoad() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
    this.launchNavigator.availableApps().then((results) => {
      for(let app in results){
        if(results[app]) {
          this.appInstalled = true;
          break;
        }
      }
    }, err => console.log(err));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  public viewLocation() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Obteniendo Ubicación'
    });

    loading.present();

    this.geolocation.getCurrentPosition(this.locationOptions).then((geo) => {
      let pos = this.movement.location.split(",");
      const navigatiorOptions: LaunchNavigatorOptions = {
        start: [geo.coords.latitude, geo.coords.longitude]
      };
      this.launchNavigator.navigate([pos[0], pos[1]], navigatiorOptions).then((nav) => {}, err => {
        this.showToast("No se encontró ninguna APP de navegación instalada");
      }); loading.dismiss();
    }).catch((error) => {
      loading.dismiss();
      this.showToast("¡Error al obtener ubicación!");
    });
  }

  private showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: "¡Error al obtener ubicación actual!",
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

}
