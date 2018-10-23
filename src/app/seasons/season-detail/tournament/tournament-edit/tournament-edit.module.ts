import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {TournamentEditPage} from './tournament-edit.page';
import {PipesModule} from '../../../../shared/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: TournamentEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class TournamentEditPageModule {
}
