import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountWithdrawConfirmPage } from './account-withdraw-confirm';

@NgModule({
  declarations: [
    AccountWithdrawConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountWithdrawConfirmPage),
  ],
})
export class AccountWithdrawConfirmPageModule {}
