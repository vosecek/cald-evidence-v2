import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CatcherDataPage } from './catcher-data.page';

const routes: Routes = [
  {
    path: '',
    component: CatcherDataPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CatcherDataPage]
})
export class CatcherDataPageModule {}
