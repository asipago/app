import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveMoneyApprovedPage } from './receive-money-approved';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    ReceiveMoneyApprovedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ReceiveMoneyApprovedPage),
  ],
})
export class ReceiveMoneyApprovedPageModule {}
