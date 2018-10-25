import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController, NavParams, ToastController} from '@ionic/angular';
import {IPlayer} from '../../../interfaces/player';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NationalityProvider} from '../../../providers/nationality/nationality';

import * as moment from 'moment';
import {TeamProvider} from '../../../providers/team/team';
import {ITeam} from '../../../interfaces/team';
import {PlayerProvider} from '../../../providers/player/player';
import {PlayerAtTeamProvider} from '../../../providers/player-at-team/player-at-team';
import {SeasonProvider} from '../../../providers/season/season';
import {AuthProvider} from '../../../providers/auth/auth';
import {OrderPipe} from '../../../shared/pipes/order';
import {ToolsService} from '../../../providers/tools.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  public data: IPlayer = null;
  protected team: ITeam = null;
  public form: FormGroup;

  constructor(
    private navParams: NavParams,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    public auth: AuthProvider,
    private playerAtTeam: PlayerAtTeamProvider,
    private fb: FormBuilder,
    protected seasonProvider: SeasonProvider,
    private playerProvider: PlayerProvider,
    protected teamProvider: TeamProvider,
    public nationalityProvider: NationalityProvider,
    private modal: ModalController) {

    this.teamProvider.load({}).catch(err => console.log(err));

    this.form = this.fb.group({
      id: [''],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      email: ['', []],
      birth_date: ['', [Validators.required]],
      team: ['', [Validators.required]],
      nationality_id: ['', [Validators.required]],
      season_id: ['', []]
    });

    this.data = this.navParams.get('player');
    this.team = this.navParams.get('team');

    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        email: this.data.email,
        sex: this.data.sex,
        team: this.team.id,
        nationality_id: this.data.nationality_id,
        birth_date: moment(this.data.birth_date).format('YYYY-MM-DD')
      });
    }

    if (!this.data || !this.data.nationality_id) {
      this.form.patchValue({nationality_id: this.nationalityProvider.data[0].id});
    }

    this.form.patchValue({season_id: new OrderPipe().transform(this.seasonProvider.data, ['-name'])[0].id});
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  ngOnInit() {
  }

  async save() {
    const load = await this.loadCtrl.create({});
    load.present().catch(err => console.log(err));
    let toRemove = false;

    let data = this.form.value;
    data = ToolsService.dateConverter(data, 'birth_date');

    this.playerProvider.updateCreateItem(data).then(async (data) => {
      if (!this.data) {
        this.playerAtTeam.assignPlayerToTeam(data, this.team, this.seasonProvider.getById(this.form.value.season_id)).then(() => {

        }, err => {
          console.log(err);
        });
      } else {
        if (this.team.id !== this.form.value.team) {
          toRemove = true;
          this.playerAtTeam.removePlayerFromTeam(data, this.team, this.seasonProvider.getById(this.form.value.season_id)).then(() => {
            this.teamProvider.findById(this.form.value.team).then(team => {
              this.playerAtTeam.assignPlayerToTeam(data, team, this.seasonProvider.getById(this.form.value.season_id)).then(() => {

              }, err => {
                console.log(err);
              });
            }, err => {
              console.log(err);
            });
          }, err => {
            console.log(err);
          });
        }
      }

      this.data = data;
      load.dismiss().catch(err => console.log(err));

      this.modal.dismiss(toRemove).catch(err => console.log(err));
    }, async err => {
      const toast = await this.toastCtrl.create({message: err, duration: 2000});
      toast.present().catch(err => console.log(err));
      return load.dismiss();
    });
  }

}
