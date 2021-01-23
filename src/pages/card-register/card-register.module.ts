import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardRegisterPage } from './card-register';

@NgModule({
  declarations: [
    CardRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(CardRegisterPage),
  ],
})
export class CardRegisterPageModule {}
