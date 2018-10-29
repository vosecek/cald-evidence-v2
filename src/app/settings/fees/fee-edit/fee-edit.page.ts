import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IFee} from '../../../interfaces/fee';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {FeeProvider} from '../../../providers/fee/fee';
import {SeasonProvider} from '../../../providers/season/season';
import {LeagueProvider} from '../../../providers/league/league';
import {ISeason} from '../../../interfaces/season';
import {ILeague} from '../../../interfaces/league';

@Component({
  selector: 'app-fee-edit',
  templateUrl: './fee-edit.page.html',
  styleUrls: ['./fee-edit.page.scss'],
})
export class FeeEditPage implements OnInit {

  public form: FormGroup;
  public fee: IFee;
  public season: ISeason;
  public league: ILeague;

  public feeTypes = ['player_per_season', 'team_per_season', 'player_per_tournament', 'team_per_tournament'];

  constructor(private fb: FormBuilder,
              private alertCtrl: AlertController,
              public seasonProvider: SeasonProvider,
              public leagueProvider: LeagueProvider,
              public modal: ModalController,
              public feeProvider: FeeProvider) {
    this.form = this.fb.group({
      id: [],
      name: ['', Validators.required],
      amount: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  public dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  async remove() {
    const self = this;
    const alert = await this.alertCtrl.create({
      header: 'Potvrdit smazání',
      message: 'Opravdu smazat poplatek?',
      buttons: [
        {
          role: 'cancel',
          text: 'Zpět'
        },
        {
          text: 'Smazat',
          handler: () => {
            self.feeProvider.removeItem(this.fee.id).then(() => {
              this.dismiss();
            }, err => {
              console.log(err);
            });
          }
        }
      ]
    });

    return alert.present();
  }

  async save() {
    this.feeProvider.updateCreateItem(this.form.value).then(() => {
      this.dismiss();
    }, err => {
      console.log(err);
    });
  }

  ngOnInit() {
    if (this.fee) {
      this.form.patchValue({
        id: this.fee.id,
        name: this.fee.name,
        amount: this.fee.amount,
        type: this.fee.type
      });
    }
  }

}
