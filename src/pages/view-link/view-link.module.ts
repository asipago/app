import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewLinkPage } from './view-link';

import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    ViewLinkPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewLinkPage),
    NgxQRCodeModule
  ],
})
export class ViewLinkPageModule {}
