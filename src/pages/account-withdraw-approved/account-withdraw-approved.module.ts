import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountWithdrawApprovedPage } from './account-withdraw-approved';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    AccountWithdrawApprovedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AccountWithdrawApprovedPage),
  ],
})
export class AccountWithdrawApprovedPageModule {}
