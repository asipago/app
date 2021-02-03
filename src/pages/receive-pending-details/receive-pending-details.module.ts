import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceivePendingDetailsPage } from './receive-pending-details';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    ReceivePendingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceivePendingDetailsPage),
    PipesModule
  ],
})
export class ReceivePendingDetailsPageModule {}
