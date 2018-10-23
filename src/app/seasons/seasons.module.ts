import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SeasonsPage} from './seasons.page';
import {PipesModule} from '../shared/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: SeasonsPage
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
  declarations: [SeasonsPage]
})
export class SeasonsPageModule {
}
