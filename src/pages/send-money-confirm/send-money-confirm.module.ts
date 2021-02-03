import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMoneyConfirmPage } from './send-money-confirm';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    SendMoneyConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(SendMoneyConfirmPage),
    PipesModule
  ],
})
export class SendMoneyConfirmPageModule {}
