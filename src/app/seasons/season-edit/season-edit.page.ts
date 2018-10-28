import {Component, OnInit} from '@angular/core';
import {SeasonProvider} from '../../providers/season/season';
import {LoadingController, ModalController} from '@ionic/angular';
import {ISeason} from '../../interfaces/season';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToolsService} from '../../providers/tools.service';

import * as moment from 'moment';
import {FeeProvider} from '../../providers/fee/fee';

@Component({
  selector: 'app-season-edit',
  templateUrl: './season-edit.page.html',
  styleUrls: ['./season-edit.page.scss'],
})
export class SeasonEditPage implements OnInit {

  public season: ISeason;
  public form: FormGroup;

  constructor(
    public seasonProvider: SeasonProvider,
    private modal: ModalController,
    public feeProvider: FeeProvider,
    private loadCtrl: LoadingController,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: ['', []],
      name: ['', [Validators.required]],
      start: ['', [Validators.required]]
    });
  }

  async save() {
    this.seasonProvider.updateCreateItem(ToolsService.dateConverter(this.form.value)).then(() => {
      this.dismiss();
    }, err => {
      console.log(err);
    });
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  ngOnInit() {
    this.feeProvider.load().catch(err => console.log(err));
    if (this.season) {
      this.form.patchValue({
        id: this.season.id,
        name: this.season.name,
        start: moment(this.season.start).format('YYYY-MM-DD')
      });
    }
  }

}
