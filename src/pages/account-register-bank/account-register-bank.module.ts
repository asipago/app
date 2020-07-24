import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountRegisterBankPage } from './account-register-bank';

@NgModule({
  declarations: [
    AccountRegisterBankPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountRegisterBankPage),
  ],
})
export class AccountRegisterBankPageModule {}
