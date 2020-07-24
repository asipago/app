import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MovementsPage } from './movements';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    MovementsPage,
  ],
  imports: [
    IonicPageModule.forChild(MovementsPage),
    PipesModule,
  ],
})
export class MovementsPageModule {}
