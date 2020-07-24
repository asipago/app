import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController, ToastController } from 'ionic-angular';
import { AbstractControl, Validators, ValidatorFn, FormGroup, FormControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { AuthProvider } from "@providers/auth/auth";

@IonicPage({
  defaultHistory: ['AccountLoginPage']
})
@Component({
  selector: 'page-account-register',
  templateUrl: 'account-register.html',
})
export class AccountRegisterPage {

  @ViewChild(Content) content: Content;

	public mainForm: FormGroup;

  public type: string = 'password';
  public showPass: boolean = false;

  public onError: {
    document: boolean;
    email: boolean;
    username: boolean;
    phone: boolean;
  } = {
    document: false,
    email: false,
    username: false,
    phone: false
  }

  constructor(
  	public readonly navCtrl: NavController,
  	public readonly navParams: NavParams,
    public readonly authProvider: AuthProvider,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController
  ) {
    this.mainForm = new FormGroup({
      firstname: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z \s]*$'),
        Validators.required
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z \s]*$'),
        Validators.required
      ])),
      nationality: new FormControl('V', Validators.required),
      document: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{7,9}?$'),
        Validators.required
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.pattern('^.{14}$'),
        Validators.required,
      ])),
      birthday: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9]+$')
      ])),
      state: new FormControl('AM', Validators.required),
      city: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z \s]*$'),
        Validators.required
      ])),
      zip: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{4,5}?$'),
        Validators.required
      ])),
      address: new FormControl('', Validators.required),
      username: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(25),
        Validators.pattern('^[a-zA-Z0-9]+$'),
        Validators.required
      ])),//, FormValidators.checkUsername),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9$-/:-?{-~!"^_`\[\\]]+$'),
        Validators.required
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.minLength(5),
        this.equalTo('password'),
        Validators.required
      ]))
    });
  }

  public ionViewDidEnter() {
    this.content.resize();
  }

	private equalTo(field_name): ValidatorFn {
	  return (control: AbstractControl): { [key: string]: any } => {
	      let isValid = control.root.value[field_name] == control.value;
	      return !isValid ? {'equalTo': {isValid}} : null;
	  };
	}

  public signUp() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Creando Cuenta'
    });

    loading.present();

    this.authProvider
      .signup(this.mainForm.value)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe((data: any) => {
        this.navCtrl.setRoot('AccountRegisterSuccessfulPage', {
          username: this.mainForm.value.username.toLowerCase()
        });
      }, err => this.handleError(err.error));
  }

  private handleError(err: any) {
    if (err.status && err.status === 401) {
      const toast = this.toastCtrl.create({
        message: 'Error al registrar la cuenta, por favor intente de nuevo...',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
    } else {
      for (let key in err) {
        this.onError[key] = err[key];
      }
    }
  }

  public showPassword() {
    this.showPass = !this.showPass;
    this.type = this.showPass ? 'text' : 'password';
  }

}
