import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceivePendingPage } from './receive-pending';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    ReceivePendingPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceivePendingPage),
    PipesModule
  ],
})
export class ReceivePendingPageModule {}
