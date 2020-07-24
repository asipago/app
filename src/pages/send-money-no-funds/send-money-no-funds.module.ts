import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMoneyNoFundsPage } from './send-money-no-funds';

@NgModule({
  declarations: [
    SendMoneyNoFundsPage,
  ],
  imports: [
    IonicPageModule.forChild(SendMoneyNoFundsPage),
  ],
})
export class SendMoneyNoFundsPageModule {}
