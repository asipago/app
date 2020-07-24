import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountLoginPage } from './account-login';

@NgModule({
  declarations: [
    AccountLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountLoginPage),
  ],
})
export class AccountLoginPageModule {}
