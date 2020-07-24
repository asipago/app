import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMoneyConfirmPage } from './send-money-confirm';

@NgModule({
  declarations: [
    SendMoneyConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(SendMoneyConfirmPage),
  ],
})
export class SendMoneyConfirmPageModule {}
