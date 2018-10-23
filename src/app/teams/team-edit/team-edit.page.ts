import {Component, OnInit} from '@angular/core';
import {TeamProvider} from '../../providers/team/team';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ITeam} from '../../interfaces/team';

import * as moment from 'moment';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.page.html',
  styleUrls: ['./team-edit.page.scss'],
})
export class TeamEditPage implements OnInit {

  protected form: FormGroup;
  protected team: ITeam;

  constructor(private teamProvider: TeamProvider, private fb: FormBuilder, private modal: ModalController) {
    this.form = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      city: [''],
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
      this.form.patchValue({
        id: this.team.id,
        name: this.team.name,
        city: this.team.city,
        www: this.team.www,
        founded_at: moment(this.team.founded_at).format('YYYY-MM-DD')
      });
    } else {
      this.form.patchValue({founded_at: moment().format('YYYY-MM-DD')});
    }
  }

}
