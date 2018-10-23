import {Component, OnInit} from '@angular/core';
import {TeamProvider} from '../providers/team/team';
import {AuthProvider} from '../providers/auth/auth';
import {ModalController} from '@ionic/angular';
import {TeamEditPage} from './team-edit/team-edit.page';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {

  constructor(public teamsProvider: TeamProvider, public auth: AuthProvider, private modal: ModalController) {
  }

  ngOnInit() {
  }

  async openEditTeam() {
    const modal = await this.modal.create({
      component: TeamEditPage
    });

    return modal.present();
  }

  ionViewWillEnter() {
  }

}
