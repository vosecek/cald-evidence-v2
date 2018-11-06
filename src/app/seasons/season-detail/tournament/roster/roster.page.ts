import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {IRoster} from '../../../../interfaces/roster';
import {PlayerAtRosterProvider} from '../../../../providers/player-at-roster/player-at-roster';
import {PlayerProvider} from '../../../../providers/player/player';
import {IPlayer} from '../../../../interfaces/player';
import {AuthProvider} from '../../../../providers/auth/auth';
import {TournamentBelongsToLeagueAndDivisionProvider} from '../../../../providers/tournament-belongs-to-league-and-division/tournament-belongs-to-league-and-division';
import {ITournament} from '../../../../interfaces/tournament';
import {TournamentProvider} from '../../../../providers/tournament/tournament';
import * as moment from 'moment';
import {PlayerListPage} from './player-list/player-list.page';
import {RosterProvider} from '../../../../providers/roster/roster';

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
    private modalSecond: ModalController,
    private auth: AuthProvider,
    private tournamentProvider: TournamentProvider,
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

  canEditRoster(): boolean {
    if (this.auth.user.isAdmin() || (this.tournament && this.auth.user.isTournamentAdmin(this.tournament.id))) return true;
    if (this.roster.team_id) {
      return (this.tournament.date > moment(new Date()));
    }

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
