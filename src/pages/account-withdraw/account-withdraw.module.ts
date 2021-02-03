import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountWithdrawPage } from './account-withdraw';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    AccountWithdrawPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AccountWithdrawPage),
  ],
})
export class AccountWithdrawPageModule {}
