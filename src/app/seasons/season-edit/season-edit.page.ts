import {Component, OnInit} from '@angular/core';
import {SeasonProvider} from '../../providers/season/season';
import {LoadingController, ModalController} from '@ionic/angular';
import {ISeason} from '../../interfaces/season';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToolsService} from '../../providers/tools.service';

import * as moment from 'moment';

@Component({
  selector: 'app-season-edit',
  templateUrl: './season-edit.page.html',
  styleUrls: ['./season-edit.page.scss'],
})
export class SeasonEditPage implements OnInit {

  public season: ISeason;
  public form: FormGroup;

  constructor(
    private seasonProvider: SeasonProvider,
    private modal: ModalController,
    private loadCtrl: LoadingController,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: ['', []],
      name: ['', [Validators.required]],
      start: ['', [Validators.required]],
      fee: ['', [Validators.required]]
    });
  }

  async save() {
    const load = await this.loadCtrl.create();
    load.present().catch(err => console.log(err));

    this.seasonProvider.updateCreateItem(ToolsService.dateConverter(this.form.value)).then(() => {
      load.dismiss().catch(err => console.log(err));
      this.dismiss();
    }, err => {
      console.log(err);
    });
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  ngOnInit() {
    if (this.season) {
      this.form.patchValue({
        id: this.season.id,
        name: this.season.name,
        fee: this.season.fee,
        start: moment(this.season.start).format('YYYY-MM-DD')
      });
    }
  }

}
