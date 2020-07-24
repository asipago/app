import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMoneyApprovedPage } from './send-money-approved';

@NgModule({
  declarations: [
    SendMoneyApprovedPage,
  ],
  imports: [
    IonicPageModule.forChild(SendMoneyApprovedPage),
  ],
})
export class SendMoneyApprovedPageModule {}
