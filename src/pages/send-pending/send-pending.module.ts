import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPendingPage } from './send-pending';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    SendPendingPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPendingPage),
    PipesModule
  ],
})
export class SendPendingPageModule {}
