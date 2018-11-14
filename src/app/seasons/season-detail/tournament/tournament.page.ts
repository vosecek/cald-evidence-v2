import {ApplicationRef, Component, OnInit} from '@angular/core';
import {RosterProvider} from '../../../providers/roster/roster';
import {ActivatedRoute} from '@angular/router';
import {TournamentProvider} from '../../../providers/tournament/tournament';
import {ITournament, ITournamentBelongsToLeagueAndDivision} from '../../../interfaces/tournament';
import {IRoster} from '../../../interfaces/roster';
import {AlertController, LoadingController, ModalController, PickerController, PopoverController} from '@ionic/angular';
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

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import * as moment from 'moment';
import {PlayerProvider} from '../../../providers/player/player';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.page.html',
  styleUrls: ['./tournament.page.scss'],
})
export class TournamentPage implements OnInit {

  public data: ITournament;
  public rosters: IRoster[] = [];
  public players_total = 0;

  private pdfInProcess = false;


  constructor(
    private roster: RosterProvider,
    private loadCtrl: LoadingController,
    private modal: ModalController,
    private popoverCtrl: PopoverController,
    private pickerCtrl: PickerController,
    private appRef: ApplicationRef,
    private playerProvider: PlayerProvider,
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

  private addPdfRosterPage(team): Promise<any> {
    const tournament_roster = [];
    const division_header = [];

    this.data.ld.forEach(ld => {
      const userRosters = this.rosters.filter(item => (item.team_id == team && item.tournament_belongs_to_league_and_division_id == ld.id));
      userRosters.forEach(el => {
        division_header.push({text: this.division.getById(ld.division_id).name, bold: true});
        // el.code = div.name + '' + (el.mark > 0 ? el.mark : '');
        tournament_roster.push(el);
      });
    });

    console.log(tournament_roster);

    const table_body = [];
    const table_width = [];
    const table_header = division_header;

    let i = 0;
    while (division_header.length > i) {
      i++;
      table_width.push(45);
    }
    table_header.unshift({text: 'Jméno hráče', bold: true});
    table_width.unshift('auto');
    table_header.push({text: 'Narozen', bold: true});
    table_width.push('auto');

    const players = [];
    let players_data = [];
    const inserted = {};

    const promises = [];

    tournament_roster.forEach(el => {
      console.log(el['player_at_roster']);
      el['player_at_roster'].forEach((p) => {
        promises.push(
          new Promise<any>((resolve, reject) => {
            this.playerProvider.findById(p.player_id).then((player) => {
              players_data.push(player);
              resolve();
            }, err => {
              resolve();
            });
          })
        );
      });
    });

    return new Promise<any>((resolve, reject) => {
      Promise.all(promises).then(() => {
        players_data = new OrderPipe().transform(players_data, ['last_name']);

        players_data.forEach((player) => {
          player.rosters = [];
          tournament_roster.forEach(roster => {
            const isInRoster = roster.player_at_roster.find(item => item.player_id == player['id']);
            if (isInRoster) {
              player.rosters.push({text: 'X', style: 'textCenter'});
            } else {
              player.rosters.push('');
            }
          });
        });

        table_body.push(table_header);

        players_data.forEach(player => {
          let row = [];
          row.push(player.last_name + ' ' + player.first_name);
          row = row.concat(player.rosters);
          if (player.birth_date) {
            const date = moment(player.birth_date);
            if (date) {
              player.birth_date = date.format('YYYY-MM-DD');
            } else {
              player.birth_date = '?';
            }
          } else {
            player.birth_date = '?';
          }

          row.push(player.birth_date);
          table_body.push(row);
        });

        const rosterPdf = [{text: 'Česká asociace létajícího disku', style: 'pageHeader'},
          {text: 'Týmová soupiska', style: 'header'},
          {text: 'Název oddílu: ' + this.team.getById(team)['name'], bold: true, style: 'list'},
          {text: 'Turnaj: ' + this.data.name + ' (' + moment(this.tournament['date']).format('YYYY-MM-DD') + ')', style: 'list'},
          {text: 'Vytisknuto: ' + moment().format('YYYY-MM-DD HH:mm'), style: 'list'},
          {text: 'Hráči na soupisce', style: 'subHeader'},
          {
            table: {
              headerRows: 1,
              widths: table_width,

              body: table_body
            }
          }];

        resolve(rosterPdf);
      });
    });
  }

  public getPDF() {
    if (this.auth.user.isAdmin()) {
      this.pdf();
    } else {
      this.pdf(parseInt(this.auth.user.getTeamId(), 10));
    }
  }

  async pdf(team?: number) {
    const load = await this.loadCtrl.create({});
    load.present().catch(err => console.log(err));


    this.pdfInProcess = true;
    const pdfContent = [];

    const promises = [];

    if (team) {
      promises.push(
        new Promise<any>((resolve, reject) => {
          this.addPdfRosterPage(team).then((page) => {
            pdfContent.push(page);
            resolve();
          });
        })
      );
    } else {
      const team2pdf = [];
      this.rosters.forEach(el => {
        if (team2pdf.indexOf(el.team_id) < 0) {
          team2pdf.push(el.team_id);
        }
      });

      let i = 0;
      team2pdf.forEach(team => {
        i++;

        promises.push(
          new Promise<any>((resolve, reject) => {
            this.addPdfRosterPage(team).then((page) => {
              if (i > 1) page[0]['pageBreak'] = 'before';
              pdfContent.push(page);
              resolve();
            });
          })
        );
      });
    }

    Promise.all(promises).then(() => {
      const docDefinition = {
        content: pdfContent,
        styles: {
          list: {
            margin: [0, 5]
          },
          header: {
            fontSize: 22,
            bold: true,
            alignment: 'center',
            margin: [0, 20]
          },
          subHeader: {
            fontSize: 14,
            bold: true,
            margin: [0, 20, 0, 5]
          },
          pageHeader: {
            fontSize: 18,
            alignment: 'left'
          },
          textCenter: {
            alignment: 'center'
          }
        }
      };

      pdfMake.createPdf(docDefinition).download('roster.pdf');
      this.pdfInProcess = false;
      load.dismiss().catch(err => console.log(err));
    });
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
              this.playerAtRoster.loadDataByMaster('roster_id', r.id, {}).then(data => {
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
