import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPendingPage } from './send-pending';

@NgModule({
  declarations: [
    SendPendingPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPendingPage),
  ],
})
export class SendPendingPageModule {}
