import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { AuthProvider } from "@providers/auth/auth";

@IonicPage()
@Component({
  selector: 'page-app-forgot',
  templateUrl: 'app-forgot.html',
})
export class AppForgotPage {

  public mainForm: FormGroup;

  public noEmail: boolean = false;
  public emailForm: boolean = true;
  public checkEmail: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private readonly loadingCtrl: LoadingController,
    public readonly restProvider: RestProvider,
    public readonly authProvider: AuthProvider
  ) {
    this.mainForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9]+$')
      ]))
    });
  }
  
  sendEmail() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando...'
    });

    loading.present();

    this.authProvider
      .forgot(this.mainForm.value.email)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(data => {
        this.emailForm = false;
        this.checkEmail = true
      }, xhr => {
        if(xhr.error.err == "Available attemps") {
          this.navCtrl.setRoot('AppForgotResetPage', {
            token: xhr.error.token
          });
        } else {
          this.noEmail = true;
        }  		
      }); 
  }

}
