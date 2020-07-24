import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewContactsPage } from './view-contacts';

@NgModule({
  declarations: [
    ViewContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewContactsPage),
  ],
})
export class ViewContactsPageModule {}
