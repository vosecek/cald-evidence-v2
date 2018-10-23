import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {TeamsPage} from './teams.page';
import {PipesModule} from '../shared/pipes/pipes.module';
import {PlayerPage} from './team-detail/player/player.page';

const routes: Routes = [
  {
    path: '',
    component: TeamsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TeamsPage],
  entryComponents: []
})
export class TeamsPageModule {
}
