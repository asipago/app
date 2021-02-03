import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMoneyApprovedPage } from './send-money-approved';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    SendMoneyApprovedPage,
  ],
  imports: [
    IonicPageModule.forChild(SendMoneyApprovedPage),
    PipesModule
  ],
})
export class SendMoneyApprovedPageModule {}
