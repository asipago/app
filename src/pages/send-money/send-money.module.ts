import { NgModule } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { SendMoneyPage } from './send-money';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    SendMoneyPage,
  ],
	providers: [
		CurrencyPipe
	],
  imports: [
  	DirectivesModule,
    IonicPageModule.forChild(SendMoneyPage),
  ],
})
export class SendMoneyPageModule {}
