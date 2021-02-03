import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardListPage } from './card-list';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    CardListPage,
  ],
  imports: [
    IonicPageModule.forChild(CardListPage),
    PipesModule
  ],
})
export class CardListPageModule {}
