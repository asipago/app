import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MobileRechargeConfirmPage } from './mobile-recharge-confirm';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    MobileRechargeConfirmPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MobileRechargeConfirmPage),
  ],
})
export class MobileRechargeConfirmPageModule {}
