import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewLinkConfirmPage } from './view-link-confirm';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    ViewLinkConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewLinkConfirmPage),
    PipesModule
  ],
})
export class ViewLinkConfirmPageModule {}
