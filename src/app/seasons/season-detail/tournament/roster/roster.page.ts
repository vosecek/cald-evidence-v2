import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, ModalController, NavParams, ToastController} from '@ionic/angular';
import {IRoster} from '../../../../interfaces/roster';
import {PlayerAtRosterProvider} from '../../../../providers/player-at-roster/player-at-roster';
import {PlayerProvider} from '../../../../providers/player/player';
import {IPlayer} from '../../../../interfaces/player';
import {AuthProvider} from '../../../../providers/auth/auth';
import {TournamentBelongsToLeagueAndDivisionProvider} from '../../../../providers/tournament-belongs-to-league-and-division/tournament-belongs-to-league-and-division';
import {ITournament} from '../../../../interfaces/tournament';
import {TournamentProvider} from '../../../../providers/tournament/tournament';

import {PlayerListPage} from './player-list/player-list.page';
import {RosterProvider} from '../../../../providers/roster/roster';

import * as moment from 'moment';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.page.html',
  styleUrls: ['./roster.page.scss'],
})
export class RosterPage implements OnInit {

  roster: IRoster;
  players: IPlayer[] = [];
  tournament: ITournament = null;

  constructor(
    private modal: ModalController,
    private loadCtrl: LoadingController,
    private modalSecond: ModalController,
    public auth: AuthProvider,
    public tournamentProvider: TournamentProvider,
    private playerProvider: PlayerProvider,
    private rosterProvider: RosterProvider,
    private alertCtrl: AlertController,
    protected playerAtRoster: PlayerAtRosterProvider,
    private tournamentTLD: TournamentBelongsToLeagueAndDivisionProvider,
    private navParams: NavParams) {
  }

  async removeRoster() {
    const self = this;
    const al = await this.alertCtrl.create({
      header: 'Opravdu odebrat soupisku týmu ' + this.roster.team_name + '?',
      buttons: [
        {
          text: 'Zpět',
          role: 'cancel',
        },
        {
          text: 'Odebrat',
          handler(): void {
            self.rosterProvider.removeItem(self.roster.id).then(() => {
              return self.modal.dismiss();
            }, err => {
              console.log(err);
            });
          }
        }
      ]
    });

    return al.present();
  }

  finalize() {

    return new Promise<any>(async (resolve, reject) => {
      const load = await this.loadCtrl.create({});
      load.present().catch(err => console.log(err));
      if (this.roster.finalized == '1') {
        this.rosterProvider.open(this.roster).then(async (data) => {
          console.log(data);
          load.dismiss();
          const toast = await new ToastController().create({message: 'Soupiska odemčena', duration: 2000});
          toast.present().catch(err => console.log(err));
          this.roster.finalized = (data['finalized'] === false ? '0' : '1');
        }, async err => {
          load.dismiss();
          const al = await this.alertCtrl.create({
            header: 'Chyba',
            message: err,
            buttons: ['OK']
          });
          al.present().catch(err => console.log(err));
        });
      } else {
        this.rosterProvider.finalize(this.roster).then(async (data) => {
          console.log(data);
          load.dismiss();
          const toast = await new ToastController().create({message: 'Soupiska uzamčena pro editaci', duration: 2000});
          toast.present().catch(err => console.log(err));
          this.roster.finalized = (data['finalized'] === false ? '0' : '1');
        }, async err => {
          load.dismiss();
          const al = await this.alertCtrl.create({
            header: 'Chyba',
            message: err,
            buttons: ['OK']
          });
          al.present().catch(err => console.log(err));
        });
      }
    });

  }

  canFinalizeRoster(): boolean {
    if (this.auth.user.isAdmin()) return true;
    return moment(this.tournament.date).add(parseInt(this.tournament.duration, 10) + 1, 'days') >= moment().startOf('day');
  }

  canEditRoster(): boolean {
    if (!this.tournament) return false;
    if (this.roster.finalized == '1') return false;
    if (this.auth.user.isAdmin()) return true;
    if (this.auth.user.isTeamAdmin(this.roster.team_id)) return true;

    return false;
  }

  async openAddPlayers() {
    const modal = await this.modalSecond.create({
      component: PlayerListPage,
      componentProps: {roster: this.roster, tournament: this.tournament}
    });
    modal.onDidDismiss().then(() => {
      this.ngOnInit();
    });
    return modal.present();
  }

  ngOnInit() {
    this.roster = this.navParams.get('roster');

    this.tournamentTLD.findById(this.roster.tournament_belongs_to_league_and_division_id).then(data => {
      this.tournamentProvider.findById(data.tournament_id).then(t => {
        this.tournament = t;
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });

    this.playerAtRoster.loadDataByMaster('roster_id', this.roster.id, {}, true).then(data => {
      this.players = data.map(x => x.player);
    }, err => {
      console.log(err);
    });
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

}
