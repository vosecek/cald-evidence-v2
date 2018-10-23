import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PlayerListPage} from './player-list.page';
import {PipesModule} from '../../../../../shared/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: PlayerListPage
  }
];

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlayerListPage]
})
export class PlayerListPageModule {
}
