import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveMoneyConfirmPage } from './receive-money-confirm';

@NgModule({
  declarations: [
    ReceiveMoneyConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiveMoneyConfirmPage),
  ],
})
export class ReceiveMoneyConfirmPageModule {}
