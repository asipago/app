import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceivePendingPage } from './receive-pending';

@NgModule({
  declarations: [
    ReceivePendingPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceivePendingPage),
  ],
})
export class ReceivePendingPageModule {}
