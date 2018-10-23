import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SeasonDetailPage} from './season-detail.page';
import {PipesModule} from '../../shared/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: SeasonDetailPage
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
  declarations: [SeasonDetailPage]
})
export class SeasonDetailPageModule {
}
