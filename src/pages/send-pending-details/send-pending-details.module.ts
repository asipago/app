import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPendingDetailsPage } from './send-pending-details';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    SendPendingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPendingDetailsPage),
    PipesModule
  ],
})
export class SendPendingDetailsPageModule {}
