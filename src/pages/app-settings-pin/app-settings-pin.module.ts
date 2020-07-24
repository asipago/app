import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppSettingsPinPage } from './app-settings-pin';

@NgModule({
  declarations: [
    AppSettingsPinPage,
  ],
  imports: [
    IonicPageModule.forChild(AppSettingsPinPage),
  ],
})
export class AppSettingsPinPageModule {}
