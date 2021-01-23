import { NgModule } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { AccountRechargeCardPage } from './account-recharge-card';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    AccountRechargeCardPage,
  ],
  providers: [
    CurrencyPipe
  ],
  imports: [
    DirectivesModule,
    IonicPageModule.forChild(AccountRechargeCardPage),
  ],
})
export class AccountRechargeCardPageModule {}
