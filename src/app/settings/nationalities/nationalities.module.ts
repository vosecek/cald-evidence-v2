import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {NationalitiesPage} from './nationalities.page';
import {PipesModule} from '../../shared/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: NationalitiesPage
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
  declarations: [NationalitiesPage]
})
export class NationalitiesPageModule {
}
