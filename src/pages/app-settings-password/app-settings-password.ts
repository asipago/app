import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AbstractControl, Validators, ValidatorFn, FormGroup, FormControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";

@IonicPage({
  defaultHistory: ['AppSettingsPage']
})
@Component({
  selector: 'page-app-settings-password',
  templateUrl: 'app-settings-password.html',
})
export class AppSettingsPasswordPage {

  public passwordForm: FormGroup;

  public oldPassType: string = 'password';
  public showOldPass: boolean = false;

  public newPassType: string = 'password';
  public showNewPass: boolean = false;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    public readonly restProvider: RestProvider,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
  ) {
  	this.setFormValues();
  }

  private setFormValues() {
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      newPassword: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9$-/:-?{-~!"^_`\[\\]]+$'),
        Validators.required
      ])),
      conPassword: new FormControl('', [
        Validators.minLength(5),
        this.equalTo('newPassword'),
        Validators.required
      ])
    });
  }

  private equalTo(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let isValid = control.root.value[field_name] == control.value;
        return !isValid ? {'equalTo': {isValid}} : null;
    };
  }

  public showOldPassword() {
    this.showOldPass = !this.showOldPass;
    this.oldPassType = this.showOldPass ? 'text' : 'password';
  }

  public showNewPassword() {
    this.showNewPass = !this.showNewPass;
    this.newPassType = this.showNewPass ? 'text' : 'password';
  }

  public updatePassword() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando Datos'
    });

    loading.present();

    this.restProvider
        .setUserPassword(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword, this.passwordForm.value.conPassword)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe(data => {
        	this.showToast("¡La contraseña se a actualizado correctamente!");
          this.setFormValues();
        }, xhr => {
          let error = "";

          switch (xhr.error.err) {
            case "New passwords does not match":
              error = "Las contraseñas no coinciden";
              break;

            case "forbidden":
              error = "Error al generar su solicitud... Por favor intente de nuevo";
              break;

            case "Old password does not match":
              error = "La contraseña actual no es correcta";
              break;
            
            default:
              error = "Error al procesar su solicitud... Por favor, ¡Intente nuevamente en unos segundos!";
              break;
          } 

          this.showToast(error);
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
