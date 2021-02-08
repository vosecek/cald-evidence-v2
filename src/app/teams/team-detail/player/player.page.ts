import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInput, LoadingController, ModalController, NavParams, Platform, ToastController} from '@ionic/angular';
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

  @ViewChild('personal_identification_number') personal_identification_number: IonInput;
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
    public plt: Platform,
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
      personal_identification_number: ['', [Validators.required]],
      nationality_id: ['', [Validators.required]],
      type: ['', []],
      country: ['', []],
      city: ['', []],
      district: [''],
      zip_code: ['', []],
      street: [''],
      orientation_number: [''],
      address_id: [''],
      descriptive_number: ['', []]
    });

    this.data = this.navParams.get('player');
    this.team = this.navParams.get('team');

    if (this.data) {
      this.playerProvider.findById(this.data.id).then(data => {
        this.data = data;

        this.form.patchValue({
          id: this.data.id,
          first_name: this.data.first_name,
          last_name: this.data.last_name,
          // email: this.data.email,
          sex: this.data.sex,
          nationality_id: this.data.nationality_id,
          birth_date: moment(this.data.birth_date).format('YYYY-MM-DD'),
          personal_identification_number: this.data.personal_identification_number
        });

        if (this.plt.is('desktop')) {
          this.form.patchValue({birth_date: moment(this.data.birth_date).format('DD/MM/YYYY')});
        }

        if (this.canViewPlayerDetails()) {
          this.playerProvider.playerAddress(this.data).then((address) => {
            if (address && address.length > 0) {
              this.form.patchValue({
                address_id: address[0].id,
                street: address[0].street,
                type: address[0].type,
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
      }, err => {
        this.dismiss();
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

  sexChanged() {
    if (this.form.value.birth_date) {
      this.birthDateChanged();
    }
  }

  async checkBirthNumber() {
    let x = this.form.value.personal_identification_number;

    let birth_date = null;
    if (this.plt.is('desktop')) {
      birth_date = moment(this.form.value.birth_date, 'DD/MM/YYYY');
    } else {
      birth_date = moment(this.form.value.birth_date);
    }

    if (birth_date) {
      let age = moment().diff(birth_date, 'years');

      if (!x) return;

      x = x.replace('/', '');

      if (!age) age = 0;
      try {
        if (x.length == 0) return true;
        if (x.length < 9) throw 1;
        let year = parseInt(x.substr(0, 2), 10);
        let month = parseInt(x.substr(2, 2), 10);
        const day = parseInt(x.substr(4, 2), 10);
        const ext = parseInt(x.substr(6, 3), 10);
        if ((x.length == 9) && (year < 54)) return true;
        let c = 0;
        if (x.length == 10) c = parseInt(x.substr(9, 1), 10);
        let m = parseInt(x.substr(0, 9), 10) % 11;
        if (m == 10) m = 0;
        if (m != c) throw 1;
        year += (year < 54) ? 2000 : 1900;
        if ((month > 70) && (year > 2003)) month -= 70;
        else if (month > 50) month -= 50;
        else if ((month > 20) && (year > 2003)) month -= 20;
        const d = new Date();
        if ((year + age) > d.getFullYear()) throw 1;
        if (month == 0) throw 1;
        if (month > 12) throw 1;
        if (day == 0) throw 1;
        if (day > 31) throw 1;
      } catch (e) {
        const toast = await this.toastCtrl.create({message: 'Rodné číslo má zřejmě nesprávný formát', duration: 2000});
        return toast.present();
      }
      console.log('rodne cislo se zda OK');
      return true;
    } else {
      return false;
    }
  }

  birthDateChanged() {
    let birth_date = this.form.value.birth_date;
    if (this.plt.is('desktop')) {
      birth_date = moment(this.form.value.birth_date, 'DD/MM/YYYY');
    }

    if (birth_date) {
      if (this.form.value.nationality_id === '1') {
        let month = moment(birth_date).format('MM');

        if (this.form.value.sex === 'female') {
          month = (parseInt(month, 10) + 50).toString();
        }
        this.form.patchValue({
          personal_identification_number: moment(birth_date).format('YY') + month + moment(birth_date).format('DD') + '/'
        });
      }
    }
  }

  nationalityChanged() {
    if (this.form.value.nationality_id === '1') {
      this.form.controls['personal_identification_number'].setValidators([Validators.required]);
      this.form.controls['personal_identification_number'].updateValueAndValidity();
      this.form.controls['city'].clearValidators();
      this.form.controls['city'].updateValueAndValidity();
      this.form.controls['street'].clearValidators();
      this.form.controls['street'].updateValueAndValidity();
      this.form.controls['descriptive_number'].clearValidators();
      this.form.controls['descriptive_number'].updateValueAndValidity();

      this.form.patchValue({type: 'residence in czechia'});
    } else {
      this.form.controls['personal_identification_number'].clearValidators();
      this.form.controls['personal_identification_number'].updateValueAndValidity();
      this.form.controls['city'].setValidators([Validators.required]);
      this.form.controls['personal_identification_number'].updateValueAndValidity();
      this.form.controls['street'].setValidators([Validators.required]);
      this.form.controls['personal_identification_number'].updateValueAndValidity();
      this.form.controls['descriptive_number'].setValidators([Validators.required]);
      this.form.controls['personal_identification_number'].updateValueAndValidity();

      this.form.patchValue({type: 'permanent residence'});
    }
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

  canViewPlayerDetails() {
    if (!this.team) return true;
    return (this.auth.user.isAdmin() || this.auth.user.isTeamAdmin(this.team.id));
  }

  async save() {

    let data = this.form.value;
    if (this.plt.is('desktop')) {
      data['birth_date'] = moment(this.form.value.birth_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    } else {
      data['birth_date'] = ToolsService.dateConverter(data, 'birth_date')['birth_date'];
    }

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

    modal.onDidDismiss().then((toClose) => {
      if (toClose['data'] && toClose['data'] === true) {
        this.dismiss();
      }
    });

    return modal.present();
  }

  pardonFee() {
    this.feeProvider.pardonFee(this.data, this.pardon_fee_season);
  }

  revokePardonFee() {

  }

}
