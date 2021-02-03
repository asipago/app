import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountWithdrawConfirmPage } from './account-withdraw-confirm';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    AccountWithdrawConfirmPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AccountWithdrawConfirmPage),
  ],
})
export class AccountWithdrawConfirmPageModule {}
