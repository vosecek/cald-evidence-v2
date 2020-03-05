import {Component, OnInit} from '@angular/core';
import {TeamProvider} from '../../providers/team/team';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ITeam} from '../../interfaces/team';

import * as moment from 'moment';
import {ModalController} from '@ionic/angular';
import {IUser} from '../../interfaces/user';
import {AuthProvider} from '../../providers/auth/auth';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.page.html',
  styleUrls: ['./team-edit.page.scss'],
})
export class TeamEditPage implements OnInit {

  public form: FormGroup;
  public team: ITeam;
  public users: { id: any, entity: any, entity_id: any, privilege: string, user: IUser }[];

  constructor(private teamProvider: TeamProvider, private fb: FormBuilder, private modal: ModalController, public auth: AuthProvider) {
    this.form = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      city: [''],
      identification_number: [''],
      www: [''],
      founded_at: ['']
    });
  }

  save() {

    const data = this.form.value;
    if (data['founded_at']) {
      if (data['founded_at']['year']) {
        data['founded_at'] = [data['founded_at']['year']['text'], data['founded_at']['month']['text'], data['founded_at']['day']['text']].join('-');
      }
    }
    this.teamProvider.updateCreateItem(data).then(() => {

    }, err => {

    });
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  ngOnInit() {
    if (this.team) {
      this.teamProvider.teamAdmins(this.team.id).then((data) => {
        this.users = data;
        console.log(this.users);
      }, err => {
        console.log(err);
      });
      this.form.patchValue({
        id: this.team.id,
        name: this.team.name,
        identification_number: this.team.identification_number,
        city: this.team.city,
        www: this.team.www,
        founded_at: moment(this.team.founded_at).format('YYYY-MM-DD')
      });
    } else {
      this.form.patchValue({founded_at: moment().format('YYYY-MM-DD')});
    }
  }

}
