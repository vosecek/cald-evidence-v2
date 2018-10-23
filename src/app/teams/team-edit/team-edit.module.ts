import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {TeamEditPage} from './team-edit.page';
import {PipesModule} from '../../shared/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: TeamEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TeamEditPage]
})
export class TeamEditPageModule {
}
