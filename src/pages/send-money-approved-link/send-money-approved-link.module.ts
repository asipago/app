import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMoneyApprovedLinkPage } from './send-money-approved-link';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    SendMoneyApprovedLinkPage,
  ],
  imports: [
    IonicPageModule.forChild(SendMoneyApprovedLinkPage),
    PipesModule
  ],
})
export class SendMoneyApprovedLinkPageModule {}
