import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MovementsPendingPage } from './movements-pending';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    MovementsPendingPage,
  ],
  imports: [
    IonicPageModule.forChild(MovementsPendingPage),
    PipesModule,
  ],
})
export class MovementsPendingPageModule {}
