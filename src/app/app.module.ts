import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { SMS } from '@ionic-native/sms';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { Camera } from '@ionic-native/camera';
import { Contacts } from '@ionic-native/contacts';
import { Clipboard } from '@ionic-native/clipboard';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Screenshot } from '@ionic-native/screenshot';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

// import { ContactsMocks } from '@ionic-native-mocks/contacts';

import { Firebase } from '@ionic-native/firebase';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { CustomFormsModule } from 'ng2-validation';

import { AuthProvider } from '@providers/auth/auth';
import { RestProvider } from '@providers/rest/rest';
import { DataProvider } from '@providers/data/data';

import { AuthInterceptor } from '@providers/auth/interceptor';

import { PipesModule } from '@pipes/pipes.module';
import { DirectivesModule } from '@directives/directives.module';

import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { MyApp } from './app.component';

// import { TOKEN_NAME } from "./config";
import { FcmProvider } from '../providers/fcm/fcm';

registerLocaleData(localeEs);

const config = {
  apiKey: "AIzaSyCeRHoaSh4r921Rp7CkkvmlLPenAgMh9Wg",
  authDomain: "asipago-c91eb.firebaseapp.com",
  databaseURL: "https://asipago-c91eb.firebaseio.com",
  projectId: "asipago-c91eb",
  storageBucket: "asipago-c91eb.appspot.com",
  messagingSenderId: "306274884925"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    PipesModule,
    DirectivesModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxQRCodeModule,
    HttpClientModule,
    CustomFormsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(config), 
    IonicModule.forRoot(MyApp, {
      preloadModules: true,
      backButtonText: 'Volver',
      backButtonIcon: 'ios-arrow-back',
      platforms: {
        ios: {
          statusbarPadding: true
        }
      }
    }),
    IonicStorageModule.forRoot({
      name: '__asipago',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    SMS,
    Crop,
    Base64,
    Device,
    Camera,
    // { provide: Contacts, useClass: ContactsMocks },
    Contacts,
    Clipboard,
    Deeplinks,
    Diagnostic,
    Screenshot,
    StatusBar,
    Geolocation,
    SplashScreen,
    SocialSharing,
    LaunchNavigator,
    FingerprintAIO,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    Firebase,
    FcmProvider,
    RestProvider,
    AuthProvider,
    DataProvider,
    CurrencyPipe
  ]
})
export class AppModule {}