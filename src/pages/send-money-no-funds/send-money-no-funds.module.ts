import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMoneyNoFundsPage } from './send-money-no-funds';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    SendMoneyNoFundsPage,
  ],
  imports: [
    IonicPageModule.forChild(SendMoneyNoFundsPage),
    PipesModule
  ],
})
export class SendMoneyNoFundsPageModule {}
