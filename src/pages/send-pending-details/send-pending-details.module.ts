import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPendingDetailsPage } from './send-pending-details';

@NgModule({
  declarations: [
    SendPendingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPendingDetailsPage),
  ],
})
export class SendPendingDetailsPageModule {}
