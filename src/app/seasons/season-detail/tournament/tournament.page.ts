import {ApplicationRef, Component, OnInit} from '@angular/core';
import {RosterProvider} from '../../../providers/roster/roster';
import {ActivatedRoute} from '@angular/router';
import {TournamentProvider} from '../../../providers/tournament/tournament';
import {ITournament, ITournamentBelongsToLeagueAndDivision} from '../../../interfaces/tournament';
import {IRoster} from '../../../interfaces/roster';
import {AlertController, ModalController, PickerController, PopoverController} from '@ionic/angular';
import {RosterPage} from './roster/roster.page';
import {TeamProvider} from '../../../providers/team/team';
import {TeamPipe} from '../../../shared/pipes/team.pipe';
import {AuthProvider} from '../../../providers/auth/auth';
import {ITeam} from '../../../interfaces/team';
import {OrderPipe} from '../../../shared/pipes/order';
import {ApiProvider} from '../../../providers/api/api';
import {DivisionPipe} from '../../../shared/pipes/division';
import {DivisionProvider} from '../../../providers/division/division';
import {TournamentEditPage} from './tournament-edit/tournament-edit.page';
import {PlayerAtRosterProvider} from '../../../providers/player-at-roster/player-at-roster';

import * as moment from 'moment';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.page.html',
  styleUrls: ['./tournament.page.scss'],
})
export class TournamentPage implements OnInit {

  public data: ITournament;
  public rosters: IRoster[] = [];
  public players_total = 0;


  constructor(
    private roster: RosterProvider,
    private modal: ModalController,
    private popoverCtrl: PopoverController,
    private pickerCtrl: PickerController,
    private appRef: ApplicationRef,
    private playerAtRoster: PlayerAtRosterProvider,
    private team: TeamProvider,
    public auth: AuthProvider,
    private api: ApiProvider,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private division: DivisionProvider,
    private tournament: TournamentProvider) {
  }

  async rosterDetail(roster: IRoster) {
    const modal = await this.modal.create({component: RosterPage, componentProps: {roster: roster}});
    modal.onDidDismiss().then(() => {
      this.ngOnInit();
    });
    return modal.present();
  }

  private addRoster(teamId, ld: ITournamentBelongsToLeagueAndDivision) {
    this.api.post('roster', {team_id: teamId, tournament_belongs_to_league_and_division_id: ld.id}).then(val => {
      this.rosterDetail(val).catch(err => console.log(err));
    });
  }

  async editItem() {
    const modal = await this.modal.create({
      component: TournamentEditPage,
      componentProps: {tournament: this.data}
    });

    modal.onDidDismiss().then(() => {
      this.ngOnInit();
    });

    return modal.present();
  }

  async showDivisionPicker() {
    if (this.data.ld.length > 1) {

      const opts = [];
      this.data.ld.forEach(async ld => {
        opts.push({
          name: 'division_' + ld.division_id,
          type: 'radio',
          label: await new DivisionPipe(this.division).transform(ld.division_id),
          value: ld
        });
      });

      const self = this;
      const al = await this.alertCtrl.create({
        header: 'Vyber divizi',
        inputs: opts,
        buttons: [
          {
            text: 'Zpět',
            role: 'cancel'
          },
          {
            text: 'Pokračovat',
            handler(data) {
              return self.showTeamRosterPicker(data);
            }
          }
        ]
      });

      return al.present();
    } else {
      return this.showTeamRosterPicker(this.data.ld[0]);
    }
  }

  async showTeamRosterPicker(ld: ITournamentBelongsToLeagueAndDivision) {
    if (this.auth.user.isAdmin() || this.auth.user.rights.length > 1) {
      const teams = [];

      if (this.auth.user.isAdmin()) {
        console.log(this.team.data);
        new OrderPipe().transform(this.team.data, ['name']).forEach((t: ITeam) => {
          teams.push({
            name: 'team_' + t.id,
            type: 'radio',
            label: t.name,
            value: t.id
          });
        });
      } else {
        this.auth.user.rights.forEach(right => {
          const r = right.split(':');
          teams.push({
            name: 'team_' + r[2],
            type: 'radio',
            label: new TeamPipe(this.team).transform(r[2]),
            value: r[2]
          });
        });
      }

      const self = this;
      const al = await this.alertCtrl.create({
        header: 'Vyber tým',
        inputs: teams,
        buttons: [
          {
            role: 'cancel',
            text: 'Zpět'
          },
          {
            text: 'Přidat',
            handler(data): void {
              self.addRoster(data, ld);
            }
          }
        ]
      });

      return al.present();
    } else {
      const team = this.auth.user.getTeamId();
      if (team) this.addRoster(team, ld);
    }

  }

  canAddRoster(): boolean {
    if (!this.data) return false;
    if (this.auth.user.isAdmin()) return true;
    return (this.data.date > moment(new Date()).add(this.data.duration, 'day'));
  }

  ngOnInit() {
    this.rosters = [];
    this.route.params.subscribe(data => {
      this.tournament.findById(data['tournament']).then(t => {
        this.data = t;

        this.data.ld.forEach((ld: ITournamentBelongsToLeagueAndDivision) => {
          this.roster.load({tournament_belongs_to_league_and_division_id: ld.id}).then((data) => {
            console.log(data);

            data.forEach(async (r, i) => {
              r.team_name = this.team.getById(r.team_id).name;
              this.playerAtRoster.loadDataByMaster('roster_id', r.id, {},).then(data => {
                r.player_at_roster = data;
                this.players_total += r.player_at_roster.length;
                this.rosters = this.rosters.concat([r]);
              }, err => {
                console.log(err);
              });
            });
            this.appRef.tick();
          });
        });
      }, err => {
        console.log(err);
      });
    });
  }

}
