import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {TeamDetailPage} from './team-detail.page';
import {PipesModule} from '../../shared/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: TeamDetailPage
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
  declarations: [TeamDetailPage],
  entryComponents: []
})
export class TeamDetailPageModule {
}
