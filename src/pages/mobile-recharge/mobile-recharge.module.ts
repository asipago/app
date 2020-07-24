import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MobileRechargePage } from './mobile-recharge';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    MobileRechargePage,
  ],
  imports: [
	  DirectivesModule,
    IonicPageModule.forChild(MobileRechargePage),
  ],
})
export class MobileRechargePageModule {}
