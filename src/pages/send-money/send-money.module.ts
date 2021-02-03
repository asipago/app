import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMoneyPage } from './send-money';
import { PipesModule } from '@pipes/pipes.module';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    SendMoneyPage,
  ],
  imports: [
    PipesModule,
    DirectivesModule,
    IonicPageModule.forChild(SendMoneyPage),
  ],
})
export class SendMoneyPageModule {}
