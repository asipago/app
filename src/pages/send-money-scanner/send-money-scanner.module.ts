import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMoneyScannerPage } from './send-money-scanner';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    SendMoneyScannerPage,
  ],
  imports: [
  	DirectivesModule,
    IonicPageModule.forChild(SendMoneyScannerPage),
  ],
})
export class SendMoneyScannerPageModule {}
