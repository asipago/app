import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppCurrencyPage } from './app-currency';

@NgModule({
  declarations: [
    AppCurrencyPage,
  ],
  imports: [
    IonicPageModule.forChild(AppCurrencyPage),
  ],
})
export class AppCurrencyPageModule {}
