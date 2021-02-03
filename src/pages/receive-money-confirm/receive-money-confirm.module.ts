import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveMoneyConfirmPage } from './receive-money-confirm';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    ReceiveMoneyConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiveMoneyConfirmPage),
    PipesModule
  ],
})
export class ReceiveMoneyConfirmPageModule {}
