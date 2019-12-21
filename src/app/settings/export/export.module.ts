import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ExportPage} from './export.page';
import {PipesModule} from '../../shared/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ExportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExportPage]
})
export class ExportPageModule {
}
