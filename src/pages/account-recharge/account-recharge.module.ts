import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountRechargePage } from './account-recharge';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    AccountRechargePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AccountRechargePage),
  ],
})
export class AccountRechargePageModule {}
