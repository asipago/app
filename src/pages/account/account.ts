import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ActionSheetController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { Storage } from "@ionic/storage";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';

import { Observable, Observer } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { RestProvider } from "@providers/rest/rest";
import { DataProvider } from "@providers/data/data";
import { AuthProvider } from "@providers/auth/auth";

import { PROFILE_NAME, IMAGE_URL } from "@app/config";

@IonicPage({
  defaultHistory: ['AccountResumePage']
})
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public mainForm: FormGroup;

  public firstname: string;
  public lastname: string;
  public document: string;
  public birthday: string;
  public phoneA: string;
  public phoneB: string;
  public email: string;
  public address: string;
  public username: string;

  public imgURL: string;
  public updatedEmail: boolean;

  private readonly imgProfileName: string = `${PROFILE_NAME}`;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private alertCtrl: AlertController,
    public readonly authProvider: AuthProvider,
    public readonly restProvider: RestProvider,
    public readonly dataProvider: DataProvider,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly storage: Storage,
    private camera: Camera,
    private crop: Crop,
    private base64: Base64
  ) {
    this.firstname = this.dataProvider.getUserFirstname();
    this.lastname = this.dataProvider.getUserLastname();
    this.document = this.dataProvider.getUserDocument();
    this.birthday = this.dataProvider.getUserBirthday();
    this.phoneA = this.dataProvider.getUserPhoneA();
    this.phoneB = this.dataProvider.getUserPhoneB();
    this.email = this.dataProvider.getUserEmail();
    this.address = this.dataProvider.getUserAddress();
    this.username = this.dataProvider.getUserName().toUpperCase();

    this.mainForm = new FormGroup({
      phoneA: new FormControl(this.formatPhone(this.phoneA), Validators.compose([
        Validators.required,
      ])),
      phoneB: new FormControl(this.phoneB != null || this.phoneB != "" ? this.formatPhone(this.phoneB) : ""),
      email: new FormControl(this.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9]+$')
      ])),
      address: new FormControl(this.address, Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(120),
      ]))
    });
  }

  ionViewDidLoad() {
    this.storage.get(this.imgProfileName).then(image => {
      this.imgURL = image;
      this.fetchNewImage(false);
    }).catch(() => {
      this.fetchNewImage(true);
    });
  }

  private fetchNewImage(triggerEvent: boolean) {
    const imageUrl = `${IMAGE_URL}/${this.dataProvider.getUserImage()}?${new Date().getTime()}`;
    this.getBase64ImageFromURL(imageUrl).subscribe((base64data: string) => {
      this.imgURL = base64data;
      this.storage.set(this.imgProfileName, this.imgURL).then(() => {
        if (triggerEvent) this.authProvider.authUser.next('update-profile');
      });
    });
  }

  changePicture() {
    let message: any;

    if (this.platform.is("ios") || this.platform.is("iphone") || this.platform.is("ipad")) {
      message = this.actionSheetCtrl.create({
        title: 'Actualizar Imagen',
        buttons: [
          {
            text: 'Galería',
            icon: "photos",
            handler: () => {
              this.uploadImage(2);
            }
          },
          {
            text: 'Cámara',
            icon: "camera",
            handler: () => {
              this.uploadImage(1);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close',
            handler: () => { },
          }
        ]
      });
    } else {
      message = this.alertCtrl.create({
        title: 'Actualizar Imagen',
        message: 'Cargar desde...',
        buttons: [
          {
            text: 'Galería',
            handler: () => {
              this.uploadImage(2);
            }
          },
          {
            text: 'Cámara',
            handler: () => {
              this.uploadImage(1);
            }
          }
        ]
      });
    }

    message.present();
  }

  private uploadImage(sourceType: number) {
    let options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 300,
      targetHeight: 300,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      allowEdit: false
    }

    this.camera.getPicture(options).then((imageData) => {
      this.crop.crop(imageData, {
        quality: 100,
        targetWidth: -1,
        targetHeight: -1
      }).then(ImagePath => {
        const filePath = ImagePath.split("?")[0];
        this.base64.encodeFile(filePath).then((base64File: string) => {
          this.finishUpload("data:image/jpeg;base64," + base64File.split("base64,")[1]);
        }, (err) => {
          this.showToast("¡Error al leer imagen del dispositivo!")
        });
      });
    });
  }

  private finishUpload(imageData: string) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Cargando Imágen...'
    });

    loading.present();

    this.restProvider
      .setPictureProfile(imageData)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.fetchNewImage(true);
      }, err => {
        this.showToast("Error, por favor intente de nuevo...")
      });
  }

  updateProfile() {
    let phoneBerror = false;

    const phoneBnumber = this.mainForm.value.length > 0 ? this.mainForm.value.phoneB.replace(/\D/g, '') : "";

    if (phoneBnumber != "" && phoneBnumber.length != 10) {
      phoneBerror = true;
      this.showToast("El formato del número telefónico secundario debe ser (412) 274-1846");
    }

    if (!phoneBerror) {
      if (this.mainForm.value.phoneA.length != 14 || this.mainForm.value.phoneA == "") {
        this.showToast("El formato del número telefónico principal debe ser (412) 274-1846");
      } else if (!this.isValidEmail(this.mainForm.value.email)) {
        this.showToast("La dirección de correo electrónico no es válida");
      } else if (this.mainForm.value.address.length < 10 || this.mainForm.value.address.length > 120) {
        this.showToast("La dirección debe contener entre 10 y 120 caracteres");
      } else {
        this.updatedEmail = false;

        let loading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: 'Actualizando Datos...'
        });

        loading.present();

        this.restProvider
          .setUserProfile(this.mainForm.value.phoneA, this.mainForm.value.phoneB, this.mainForm.value.email.toUpperCase(), this.mainForm.value.address)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe(data => {
            this.showToast("¡Tus datos han sido actualizados!");
            this.updatedEmail = this.dataProvider.getUserEmail() != this.mainForm.value.email.toUpperCase();
          }, err => {
            switch (err.type) {
              case "format":
                this.showToast("El formato del número telefónico debe ser (412) 274-1846");
                break;

              case "email":
                this.showToast("El email ya se encuentra registrado");
                break;

              case "phone_a":
                this.showToast("El número " + this.mainForm.value.phoneA + " ya se cuentra en uso");
                break;

              case "phone_b":
                this.showToast("El número " + this.mainForm.value.phoneB + " ya se cuentra en uso");
                break;

              default:
                this.showToast("Al parecer hay problemas de conexión... Por favor intenta de nuevo en unos segundos");
                break;
            }
          });
      }
    }
  }

  private isValidEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }

  private formatPhone(number) {
    if (number) {
      number = number.replace(/\D/g, '');
      number = number.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }
    return number;
  }

  private showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  private getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        }; img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  private getBase64Image(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL("image/png");
  }

}
