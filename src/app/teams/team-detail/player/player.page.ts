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
import {ToolsService} from '../../../providers/tools.service';
import {ISeason} from '../../../interfaces/season';
import {FeeProvider} from '../../../providers/fee/fee';
import {ApiProvider} from '../../../providers/api/api';
import {PlayerHistoryPage} from './player-history/player-history.page';
import {OrderPipe} from '../../../shared/pipes/order';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  public data: IPlayer = null;
  protected team: ITeam = null;
  public form: FormGroup;
  public canRevokeFee = false;
  public pardon_fee_season: ISeason;

  public transfer_season: ISeason;
  public transfer_team: ITeam;

  constructor(
    private navParams: NavParams,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private api: ApiProvider,
    public auth: AuthProvider,
    private feeProvider: FeeProvider,
    private playerAtTeam: PlayerAtTeamProvider,
    private fb: FormBuilder,
    public seasonProvider: SeasonProvider,
    private playerProvider: PlayerProvider,
    protected teamProvider: TeamProvider,
    public nationalityProvider: NationalityProvider,
    private modal2: ModalController,
    private modal: ModalController) {

    this.teamProvider.load({}).catch(err => console.log(err));

    this.form = this.fb.group({
      id: [''],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      // email: ['', []],
      birth_date: ['', [Validators.required]],
      nationality_id: ['', [Validators.required]],
      type: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      district: [''],
      zip_code: ['', [Validators.required]],
      street: [''],
      orientation_number: [''],
      address_id: [''],
      descriptive_number: ['', [Validators.required]]
    });

    this.data = this.navParams.get('player');
    this.team = this.navParams.get('team');

    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        // email: this.data.email,
        sex: this.data.sex,
        nationality_id: this.data.nationality_id,
        birth_date: moment(this.data.birth_date).format('YYYY-MM-DD')
      });

      this.playerProvider.playerAddress(this.data).then((address) => {
        if (address && address.length > 0) {
          this.form.patchValue({
            address_id: address[0].id,
            street: address[0].street,
            zip_code: address[0].zip_code,
            country: address[0].country,
            city: address[0].city,
            district: address[0].district,
            orientation_number: address[0].orientation_number,
            descriptive_number: address[0].descriptive_number
          });
        }
      }, err => {
        console.log(err);
      });
    }

    if (!this.data || !this.data.nationality_id) {
      this.form.patchValue({nationality_id: this.nationalityProvider.data[0].id});
    }
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  ngOnInit() {

  }

  transfer() {
    this.playerAtTeam.removePlayerFromTeam(this.data, this.team, this.transfer_season).then(() => {
      this.playerAtTeam.assignPlayerToTeam(this.data, this.transfer_team, this.transfer_season).then(() => {
        this.modal.dismiss(true).catch(err => console.log(err));
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });
  }

  async save() {

    let data = this.form.value;
    data = ToolsService.dateConverter(data, 'birth_date');

    this.playerProvider.updateCreateItem(data).then(async (data) => {
      const address = {
        id: this.form.value.address_id,
        type: this.form.value.type,
        city: this.form.value.city,
        zip_code: this.form.value.zip_code,
        street: this.form.value.street,
        district: this.form.value.district,
        descriptive_number: this.form.value.descriptive_number,
        orientation_number: this.form.value.orientation_number,
        country: this.form.value.country
      };

      this.playerProvider.updateCreateAddress((this.data ? this.data : data), address).then(() => {

      }, err => {
        console.log(err);
      });

      if (!this.data) {
        this.playerAtTeam.assignPlayerToTeam(data, this.team, new OrderPipe().transform(this.seasonProvider.data, ['-name'])[0]).then(() => {

        }, err => {
          console.log(err);
        });
      }

      this.data = data;

      this.modal.dismiss().catch(err => console.log(err));
    }, async err => {
      const toast = await this.toastCtrl.create({message: err, duration: 2000});
      return toast.present();
    });
  }

  public isPardonFee() {
    // this.api.get('')
  }

  async history() {
    const modal = await this.modal2.create({
      component: PlayerHistoryPage,
      componentProps: {player: this.data}
    });

    return modal.present();
  }

  pardonFee() {
    this.feeProvider.pardonFee(this.data, this.pardon_fee_season);
  }

  revokePardonFee() {

  }

}
