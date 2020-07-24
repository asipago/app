import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
	  DirectivesModule,
    IonicPageModule.forChild(AccountPage),
  ],
})
export class AccountPageModule {}
