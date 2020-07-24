import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from '@providers/data/data';

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-mobile-recharge',
  templateUrl: 'mobile-recharge.html',
})
export class MobileRechargePage {
  
  public currencySymbol: string;

  public amounts = [];
	public carrier: string = 'unset';

  public isDisabled: boolean;
  public availableFunds: number = 0;
  public rateValue: number;

  public mainForm: FormGroup;

  private iniAmount: number;
  private incAmount: number;
  private maxAmount: number;

  constructor(
  	public navCtrl: NavController,
    public modalCtrl: ModalController,
    public restProvider: RestProvider,
    private formBuilder: FormBuilder,
    public dataProvider: DataProvider,
    private readonly toastCtrl: ToastController
  ) {
    this.rateValue = 0;

    this.iniAmount = 2000;
    this.incAmount = 5000;
    this.maxAmount = 100000;

    this.mainForm = this.formBuilder.group({
      amount: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{1,6}([,|.][0-9]{1,2})?$'),
        Validators.required
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        //Validators.pattern('^\([0-9]{1}\d{2}\) \d{3}-\d{4}$')
      ]))
    });
  }

  async ionViewDidEnter() {
    let value = 0;
    this.amounts.length = 0;
    
    this.currencySymbol = this.dataProvider.getCurrencySymbol();

    switch(this.currencySymbol) {
      case "USD":
        this.iniAmount = 1;
        this.incAmount = 5;
        this.maxAmount = 10;
        
        const rate: any = await this.restProvider.getRate("USD");
        this.rateValue = rate.amount;

        break;

      default:
        this.iniAmount = 2000;
        this.incAmount = 5000;
        this.maxAmount = 100000;
        break;
    }

    this.restProvider.getFunds().then(wallet => {
      this.availableFunds = wallet.funds;
      this.isDisabled = this.availableFunds < this.iniAmount;
    });

    this.amounts.push(this.iniAmount);

    while (value < this.maxAmount) {
      value += this.incAmount;
      this.amounts.push(value);
    }
  }

  public setCarrier(carrier: string) {
  	this.carrier = carrier;
    this.mainForm.controls["phone"].setValue("");
  }

  public showContacts() {
    if (this.carrier == 'unset') {
      const toast = this.toastCtrl.create({
        message: "Selecciona primero una operadora",
        duration: 5000,
        position: 'bottom'
      });

      toast.present();
    } else {
      let modal = this.modalCtrl.create('ViewContactsPage', {
        filterCarrier: true,
        filterContacts: false,
        carrier: this.carrier
      });
      modal.onDidDismiss(data => {
        if(data) this.mainForm.controls["phone"].setValue(data.phone);
      });
      modal.present();
    }
  }

  public validate() {
    if(this.mainForm.value.phone.length == 14 && this.mainForm.value.amount != "") {
      this.navCtrl.push('MobileRechargeConfirmPage', {
        number: this.mainForm.value.phone,
        amount: this.mainForm.value.amount,
        carrier: this.carrier
      });
    }
  }

}
