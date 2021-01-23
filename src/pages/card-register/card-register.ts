import { Component, ViewChild } from '@angular/core';
import { IonicPage, ViewController, NavController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { CardModel, CardHolderModel } from '@models/card-model';

import { DataProvider } from '@providers/data/data';
import { RestProvider } from '@providers/rest/rest';

@IonicPage({
  defaultHistory: ['CardListPage']
})
@Component({
  selector: 'page-card-register',
  templateUrl: 'card-register.html',
})
export class CardRegisterPage {

  public mainForm: FormGroup;
  public allowedYears: any;
  public currentCurrency: string;

  @ViewChild('ccNumber') ccNumberField: any;

  constructor(
  	public navCtrl: NavController,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly restProvider: RestProvider,
    public dataProvider: DataProvider,
  	private formBuilder: FormBuilder,
  	public viewCtrl : ViewController
  ) {
    //this.currentCurrency = "";
    this.allowedYears = 2000;
    this.mainForm = this.formBuilder.group({
      /* routing:  new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{20}?$'),
        Validators.required
      ])), */
      cardNumber: new FormControl('', Validators.compose([
        Validators.pattern('^[ 0-9]*$'),
        Validators.minLength(17),
        Validators.required
      ])),
      type: ['C', Validators.required],
      date: ['', Validators.required],
      /* year:  new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{4}?$'),
        Validators.required
      ])),
      month:  new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{1,2}?$'),
        Validators.required
      ])), */
      cvc:  new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{3,4}?$'),
        Validators.required
      ])),
      country: new FormControl('US', Validators.required),
      city: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(255),
        Validators.pattern('^[a-zA-ZñáéíóúüÑ \s]*$'),
        Validators.required
      ])),
      zip: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{4,6}?$'),
        Validators.required
      ])),
      address: new FormControl('', Validators.required),
    });
  }

  ionViewDidEnter() {
    this.currentCurrency = this.dataProvider.getCurrency();
    //const date = new Date().toISOString();
    this.allowedYears = (new Date()).getFullYear() + 15;

    if (this.currentCurrency == "BS") {
      this.mainForm.get('country').clearValidators();
      this.mainForm.get('city').clearValidators();
      this.mainForm.get('zip').clearValidators();
      this.mainForm.get('address').clearValidators();
    }
  }

  /* onSelectChange(selectedValue: any) {
    this.selectedBank = selectedValue;
  } */

  registerCard() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando Datos'
    });

    loading.present();

    const ccDate = this.mainForm.value.date.split("-")

    const holder = new CardHolderModel(
      this.mainForm.value.address,
      this.mainForm.value.city,
      this.mainForm.value.country,
      this.mainForm.value.zip
    );

    const card = new CardModel(
      this.mainForm.value.type,
      this.mainForm.value.cardNumber,
      ccDate[1], ccDate[0],
      this.mainForm.value.cvc,
      holder
    );

    this.restProvider
        .registerCard(card)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe(() => {
          this.viewCtrl.dismiss();
        }, err => this.handleError(err));
  }

  private handleError(error: any) {
    let message: string;
    
    switch (error.status) {
      case 401:
        message = 'Error al procesar su solicitud ... Por favor, ¡Intente nuevamente en unos segundos!';
        break;
      case 409:
        message = 'El número de tarjeta no es válido, por favor verifique he intente de nuevo';
        break;
      default:
        message = 'Esta tarjeta ya se encuentra registrada';
        break;
    }

    this.showToast(message);
  }

  private showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  creditCardNumberSpacing() {
    const input = this.ccNumberField._native.nativeElement;
    const { selectionStart } = input;
    const { cardNumber } = this.mainForm.controls;

    let trimmedCardNum = cardNumber.value.replace(/\s+/g, '');

    if (trimmedCardNum.length > 16) {
      trimmedCardNum = trimmedCardNum.substr(0, 16);
    }

    /* Handle American Express 4-6-5 spacing */
    const partitions = trimmedCardNum.startsWith('34') || trimmedCardNum.startsWith('37') 
                       ? [4,6,5] : [4,4,4,4];

    const numbers = [];
    let position = 0;
    partitions.forEach(partition => {
      const part = trimmedCardNum.substr(position, partition);
      if (part) numbers.push(part);
      position += partition;
    })

    cardNumber.setValue(numbers.join(' '));

    /* Handle caret position if user edits the number later */
    if (selectionStart < cardNumber.value.length - 1) {
      input.setSelectionRange(selectionStart, selectionStart, 'none');
    }
  }

  public dismiss() { this.navCtrl.pop(); }
}
