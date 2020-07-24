import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AbstractControl, Validators, ValidatorFn, FormGroup, FormControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { AuthProvider } from "@providers/auth/auth";

@IonicPage()
@Component({
  selector: 'page-app-forgot-reset',
  templateUrl: 'app-forgot-reset.html',
})
export class AppForgotResetPage {

  public attemps: number;
  private token: string;

  public onError: boolean;
  public securityCheck: boolean;

  public badAnswers: boolean;
  public noSecurity: boolean;

  public questionA: string;
  public questionB: string;

  private mainForm: FormGroup;
  private passwordForm: FormGroup;

  public newPassType: string;
  public showNewPass: boolean;

  public isLoading: boolean;
  public passwordUpdated: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private readonly loadingCtrl: LoadingController,
    public readonly restProvider: RestProvider,
    public readonly authProvider: AuthProvider
  ) {
    this.token = navParams.get('token');

    this.attemps = 0;

    this.questionA = "";
    this.questionB = "";

  	this.onError = false;
    this.securityCheck = true;

    this.badAnswers = false;
    this.noSecurity = false;

    this.newPassType = 'password';
    this.showNewPass = false;

    this.isLoading = false;
    this.passwordUpdated = false;

    this.mainForm = new FormGroup({
      answerA: new FormControl('', [
        Validators.minLength(5),
        Validators.maxLength(150),
        Validators.required
      ]),
      answerB: new FormControl('', [
        Validators.minLength(5),
        Validators.maxLength(150),
        Validators.required
      ])
    });

    this.passwordForm = new FormGroup({
      newPassword: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9$-\/:-?{-~!"^_`\[\]]+$'),
        Validators.required
      ])),
      conPassword: new FormControl('', [
        Validators.minLength(5),
        this.equalTo('newPassword'),
        Validators.required
      ])
    });
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando...'
    });

    loading.present();

    this.authProvider
        .confirmToken(this.token, 'clave')
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((response: any) => {
          this.token = response.token;
          this.attemps = response.attemps;
          this.getQuestions();
        }, err => {
          this.onError = true
        });
  }

	private equalTo(field_name): ValidatorFn {
	  return (control: AbstractControl): { [key: string]: any } => {
      let isValid = control.root.value[field_name] == control.value;
      return !isValid ? {'equalTo': {isValid}} : null;
	  };
	}

  private getQuestions() {
    this.authProvider.questions(this.token).subscribe((questions: [string, string]) => {
      this.questionA = questions[0];
      this.questionB = questions[1];
    }, () => {
      this.noSecurity = true;
    });
  }

  showNewPassword() {
    this.showNewPass = !this.showNewPass;
    this.newPassType = this.showNewPass ? 'text' : 'password';
  }

  formSubmit(formOption: string) {
    this.isLoading = true;
    this.authProvider
        .reset({
          token: this.token,
          questionA: this.questionA,
          questionB: this.questionB,
          answerA: this.mainForm.value.answerA,
          answerB: this.mainForm.value.answerB,
          option: formOption,
          password: this.passwordForm.value.newPassword,
          confirmPassword: this.passwordForm.value.conPassword
        })
        .pipe(finalize(() => this.isLoading = false))
        .subscribe((response: {status: string}) => {
          if(formOption == 'reset')
            this.passwordUpdated = true;
          else
            this.securityCheck = response.status != "Ok";
        }, err => {
          this.badAnswers = true;
          this.attemps = this.attemps - 1;
        });
  }

  skipSecurity() {
    this.noSecurity = false;
    this.securityCheck = false;
  }

  goHome() {
    this.navCtrl.setRoot('AppHomePage');
  }

}
