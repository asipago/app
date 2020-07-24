import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountRegisterPage } from './account-register';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    AccountRegisterPage,
  ],
  imports: [
	  DirectivesModule,
    IonicPageModule.forChild(AccountRegisterPage),
  ],
})
export class AccountRegisterPageModule {}
