import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceivePendingDetailsPage } from './receive-pending-details';

@NgModule({
  declarations: [
    ReceivePendingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceivePendingDetailsPage),
  ],
})
export class ReceivePendingDetailsPageModule {}
