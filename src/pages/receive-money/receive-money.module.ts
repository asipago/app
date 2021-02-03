import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveMoneyPage } from './receive-money';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    ReceiveMoneyPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ReceiveMoneyPage),
  ],
})
export class ReceiveMoneyPageModule {}
