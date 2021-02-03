import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MobileRechargeApprovedPage } from './mobile-recharge-approved';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    MobileRechargeApprovedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MobileRechargeApprovedPage),
  ],
})
export class MobileRechargeApprovedPageModule {}
