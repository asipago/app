import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { UserInterface } from '@interfaces/user-interface';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";
import { AuthProvider } from "@providers/auth/auth";

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-receive-money',
  templateUrl: 'receive-money.html',
})
export class ReceiveMoneyPage {
  
  public currencySymbol: string;

  public availableFunds: number = 0;
  public secure: boolean = true;

  public isLink: boolean = false;
  public mainForm: FormGroup;  
  public userWallet: boolean;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    public modalCtrl: ModalController,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly restProvider: RestProvider,
    private formBuilder: FormBuilder
  ) {
    this.setForm();
  }

  ionViewWillEnter() {
    this.currencySymbol = this.dataProvider.getCurrencySymbol();
  }

  ionViewDidEnter() {
    this.authProvider.isOwnerWallet().then(isOwner => this.userWallet = isOwner);
    this.restProvider.getFunds().then(wallet => {
      this.availableFunds = wallet.funds;
    });
  }

  onSelectChange(selectedValue: any) { this.setForm(); }

  public showContacts(reference) {
    let modal = this.modalCtrl.create('ViewContactsPage', {
      filterContacts: true
    });
    modal.onDidDismiss(data => {
      if(data) { this.setUsernameFromContacts(data.number) }
    });
    modal.present();
  }

  private setUsernameFromContacts(phone: string) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando Datos'
    });

    loading.present();

    this.restProvider
        .findUserByPhoneNumber(phone)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((user: any) => {
          this.mainForm.controls['username'].setValue(user.username);
        }, err => this.userNotFound(err));
  }

  private setForm() {
    this.mainForm = this.formBuilder.group({
      username: this.isLink ? [''] : ['', Validators.required],
      description: [''],
      amount: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{1,6}([,|.][0-9]{1,2})?$'),
        Validators.required
      ])),
    });
  }

  public checkTransaction() {
    if(this.isLink) {
      this.changePage("DIRECT_LINK");
    } else {
      let username = this.mainForm.value.username.toUpperCase();

      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Verificando Datos'
      });

      loading.present();

      if(this.mainForm.value.amount == 0) {
        loading.dismiss();
        this.showToast("Por favor ingrese un monto");
      } else if(username.match(/^V-|E-|P-/)) {
        let value = username.split("-");
        this.restProvider
            .findUserByDocument(value[0], value[1])
            .pipe(finalize(() => loading.dismiss()))
            .subscribe((data: UserInterface) => {
              this.changePage(data);
            }, err => this.showToast("El número de documento no se encuentra registrado"));
      } else if(username.match(/^G-|J-|C-/)) {
        if(this.userWallet) {
          loading.dismiss();
          this.showToast("Función no permitida");
        } else {
          this.restProvider
              .findCompanyByDocument(username)
              .pipe(finalize(() => loading.dismiss()))
              .subscribe((data: any) => {
                this.changePage(data);
              }, err => this.showToast("El R.I.F. no se encuentra asociado a ninguna cuenta"));
        }
      } else {
        this.restProvider
            .findUserByNickname(username)
            .pipe(finalize(() => loading.dismiss()))
            .subscribe((data: any) => {
              this.changePage(data);
            }, err => this.userNotFound(err));
      }
    }
  }

  private changePage(data) {
    let values: any;

    if(data.rif) {
      let document = data.rif.split("-");
      values = {
        username: data.name,
        amount: this.mainForm.value.amount,
        description: this.mainForm.value.description,
        secure: this.secure,
        isLink: this.isLink,
        userDocument: document[1],
        userType: document[0],
        isCompany: true,
        userID: data.id
      };
    } else {
      values = {
        username: '@' + data.username,
        amount: this.mainForm.value.amount,
        description: this.mainForm.value.description,
        secure: this.secure,
        isLink: this.isLink,
        userDocument: data.document,
        userType: data.nationality,
        isCompany: false,
        userID: data.id
      };
    }

    this.navCtrl.push('ReceiveMoneyConfirmPage', values);
  }

  private userNotFound(error: any) {
    this.showToast(error.status && error.status === 401 ?
      'El usuario a quien intenta enviar no se encuentra registrado' :
      `Unexpected error: ${error.statusText}`
    )
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
