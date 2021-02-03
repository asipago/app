import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountResumePage } from './account-resume';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    AccountResumePage,
  ],
  imports: [
    IonicPageModule.forChild(AccountResumePage),
    PipesModule
  ],
})
export class AccountResumePageModule {}
