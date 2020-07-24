import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MovementsDetailsPage } from './movements-details';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    MovementsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MovementsDetailsPage),
    PipesModule,
  ],
})
export class MovementsDetailsPageModule {}
