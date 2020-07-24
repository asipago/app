import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveMoneyPage } from './receive-money';

@NgModule({
  declarations: [
    ReceiveMoneyPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiveMoneyPage),
  ],
})
export class ReceiveMoneyPageModule {}
