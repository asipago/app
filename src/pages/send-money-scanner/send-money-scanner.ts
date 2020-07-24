import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";

import { UserInterface } from "@interfaces/user-interface";

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-send-money-scanner',
  templateUrl: 'send-money-scanner.html',
})
export class SendMoneyScannerPage {
  
  public currencySymbol: string;

  public mainForm: FormGroup;  

  public username: string;
  public availableFunds: number = 0;

  private userType: string;
  private userDocument: string;

  public scannerData: {
    alias: string,
    username: string,
    document: string
  } = { alias: "", username: "", document: "" }

  private readonly options: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
  };

  constructor(
  	public navCtrl: NavController,
    public dataProvider: DataProvider,
    public modalCtrl: ModalController,
    private readonly barcodeScanner: BarcodeScanner,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public readonly restProvider: RestProvider,
    private readonly geolocation: Geolocation,
    private formBuilder: FormBuilder,
  ) {
    this.initCamera();
    this.mainForm = this.formBuilder.group({
      username: ['', Validators.required],
      description: [''],
      amount: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{1,6}([,|.][0-9]{1,2})?$'),
        Validators.required
      ])),
    });
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  ionViewDidEnter() {
    this.restProvider.getFunds().then(wallet => {
      this.availableFunds = wallet.funds;
    });
  }

  makePayment() {
    if(this.dataProvider.getSettings().check_transaction_pin) {
      let pinModal = this.modalCtrl.create('AppConfirmPinPage');
      pinModal.onDidDismiss(pin => {
        console.log(pin || "invalid");
        pin = pin || "";
        if(pin.length == 6)
          this.confirmTransaction(pin);
      });
    } else {
      this.confirmTransaction();
    }
  }

  private confirmTransaction(pin?: string) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Realizando Pago'
    });

    loading.present();

    this.geolocation.getCurrentPosition(this.options).then((geo) => {
      let coords = geo.coords.latitude + "," + geo.coords.longitude;
      loading.setContent("Verificando Datos");
      this.restProvider
          .generateSendMovement(this.mainForm.value.amount, this.userType, this.userDocument, this.mainForm.value.description, coords, pin, true)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe((data: any) => {
            this.navCtrl.setRoot('SendMoneyApprovedPage', {
              movement: {
                reference: data.movement.reference,
                date: data.movement.date,
                amount: data.movement.amount,
                percentage: data.movement.percentage,
                finalAmount: this.getFinalAmount(data.movement.amount),
                concept: data.movement.concept || "",
                location: coords,
                user: {
                  name: data.user.name,
                  username: this.username,
                  document: data.user.document
                }
              }
            });
          }, err => this.showToast("¡Error al procesar pago!"));
    }).catch((error) => {
      loading.dismiss()
      this.showToast("¡Error al obtener ubicación!");
    });
  }

  initCamera() {
    this.barcodeScanner.scan().then(barcodeData => {
      let scannedCode: string = barcodeData.text;

      if(scannedCode.startsWith("https://asipago.com/link/")) {
        this.confirmLink(scannedCode.replace("https://asipago.com/link/", ""));
      } else if(scannedCode.startsWith("https://asipago.com/qr/")) {

        let loading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: 'Verificando Datos'
        });

        loading.present();

        let scannedText = scannedCode.replace("https://asipago.com/qr/", "");

        if(scannedText == this.dataProvider.getUserDocument()) {
          this.showToast("¡Código QR no válido! (no puede realizar el pago a la misma cuenta)");
          loading.dismiss();
        } else {
          let document = scannedText.split("-");

          this.userType = document[0];
          this.userDocument = document[1];

          //if(this.userType.match(/^V|E|P/)) {
          if(this.userType.match(/^E|P/) || (this.userType.match(/^V/) && this.userDocument.length < 9)) {
            this.restProvider
                .findUserByDocument(this.userType, this.userDocument)
                .pipe(finalize(() => loading.dismiss()))
                .subscribe((data: UserInterface) => {
                  this.username = '@' + data.username;
                  this.mainForm.controls['username'].setValue(this.username);
                  this.scannerData.alias = data.firstname + " " + data.lastname;
                  this.scannerData.username = data.username;
                  this.scannerData.document = data.nationality + "-" + data.document;
                }, err => this.showToast('El usuario a quien intenta enviar no se encuentra registrado'));
          } else {
            this.restProvider
                .findCompanyByDocument(this.userType + "-" + this.userDocument)
                .pipe(finalize(() => loading.dismiss()))
                .subscribe((data: any) => {
                  this.username = data.name;
                  this.mainForm.controls['username'].setValue(this.username);
                  this.scannerData.alias = data.alias;
                  this.scannerData.username = data.name;
                  this.scannerData.document = data.rif;
                }, err => this.showToast('La empresa a quien intenta enviar no se encuentra registrada'));
          }
        }
      } else {
        this.showToast("¡QR no válido!");
      }
    }, (err) => {
      this.showToast("¡Error al escanear código QR!");
    });
  }

  private getFinalAmount(amount: number) {
    return amount - ((this.dataProvider.getPercent() * amount) / 100);
  }

  private confirmLink(linkCode: string) {
    this.navCtrl.setRoot('ViewLinkConfirmPage', {
      code: linkCode
    });
  }

  private showToast(message: string) {    
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });    
    toast.present();
  }
}
