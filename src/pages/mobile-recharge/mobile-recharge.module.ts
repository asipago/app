import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MobileRechargePage } from './mobile-recharge';
import { DirectivesModule } from '@directives/directives.module';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    MobileRechargePage,
  ],
  imports: [
    PipesModule,
	  DirectivesModule,
    IonicPageModule.forChild(MobileRechargePage),
  ],
})
export class MobileRechargePageModule {}
