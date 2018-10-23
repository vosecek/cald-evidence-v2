import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {TournamentPage} from './tournament.page';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {RosterPage} from './roster/roster.page';
import {PlayerListPage} from './roster/player-list/player-list.page';

const routes: Routes = [
  {
    path: '',
    component: TournamentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TournamentPage, RosterPage, PlayerListPage],
  entryComponents: [RosterPage, PlayerListPage]
})
export class TournamentPageModule {
}
