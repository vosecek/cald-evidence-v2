import {Component, OnInit} from '@angular/core';
import {SeasonProvider} from '../providers/season/season';
import {AuthProvider} from '../providers/auth/auth';
import {ModalController} from '@ionic/angular';
import {SeasonEditPage} from './season-edit/season-edit.page';
import {ISeason} from '../interfaces/season';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.page.html',
  styleUrls: ['./seasons.page.scss'],
})
export class SeasonsPage implements OnInit {

  constructor(public seasonProvider: SeasonProvider, private modal: ModalController, public auth: AuthProvider) {
  }

  ngOnInit() {
  }

  async addItem() {
    const modal = await this.modal.create({
      component: SeasonEditPage
    });

    modal.onDidDismiss().then(() => {
      this.ngOnInit();
    });

    return modal.present();
  }

  detail(data): void {

  }

}
