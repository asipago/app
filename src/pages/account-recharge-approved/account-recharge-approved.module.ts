import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountRechargeApprovedPage } from './account-recharge-approved';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    AccountRechargeApprovedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AccountRechargeApprovedPage),
  ],
})
export class AccountRechargeApprovedPageModule {}
