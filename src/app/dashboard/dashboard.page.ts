import {Component, OnInit} from '@angular/core';
import {AuthProvider} from '../providers/auth/auth';
import {ApiProvider} from '../providers/api/api';
import {ITeam} from '../interfaces/team';
import {SeasonProvider} from '../providers/season/season';
import {OrderPipe} from '../shared/pipes/order';
import {TeamProvider} from '../providers/team/team';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {LoadingController, Platform} from '@ionic/angular';
import {FeeNeededForLeagueProvider} from '../providers/fee-needed-for-league/fee-needed-for-league';
import {FeeProvider} from '../providers/fee/fee';
import {IFee} from '../interfaces/fee';
import {TournamentProvider} from '../providers/tournament/tournament';
import {ITournament} from '../interfaces/tournament';

import * as moment from 'moment';
import {ExportService} from '../services/export.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  protected feeLoading = false;
  season_for_fee: any;
  fee_for_season: IFee;
  protected teams: ITeam[] = [];

  tournaments: ITournament[] = [];

  pdfObj = null;

  constructor(
    private platform: Platform,
    private feeProvider: FeeProvider,
    public tournamentProvider: TournamentProvider,
    private feeNeeded: FeeNeededForLeagueProvider,
    public exportService: ExportService,
    private loadCtrl: LoadingController,
    public authProvider: AuthProvider,
    private api: ApiProvider,
    private season: SeasonProvider,
    private teamProvider: TeamProvider) {
  }

  showFee(): boolean {
    const date = new Date();
    if (this.feeLoading === true) return false;
    return (date.getMonth() > 8);
  }

  ngOnInit() {

    this.tournamentProvider.load({season_id: new OrderPipe().transform(this.season.data, ['-name'])[0].id}).then((data: ITournament[]) => {
      data.forEach(e => {
        if (moment(e.date) > moment()) {
          this.tournaments.push(e);
        }
      });
    }, err => {
      console.log(err);
    });

    this.season_for_fee = this.season.data.find(it => it.name == new Date().getFullYear());
    if (this.season_for_fee) {
      this.feeNeeded.load({since_season: this.season_for_fee.id}).then((data) => {
        if (data[0]) {
          this.feeProvider.findById(data[0].fee_id).then((fee) => {
            this.fee_for_season = fee;
          }, err => {
            console.log(err);
          });
        }
      });
    }

    if (this.authProvider.user.isAdmin()) {
      this.teamProvider.load().then(() => {
        this.teams = this.teamProvider.data;
      });
    } else {
      this.authProvider.user.rights.forEach((el) => {
        const data = el.split(':');
        if (data.length > 0) {
          this.teamProvider.findById(data[2]).then(t => {
            this.teams.push(t);
          }, err => {
            console.log(err);
          });
        }
      });
    }
  }

  async getFee(team: ITeam) {
    const load = await this.loadCtrl.create();
    load.present().catch(err => console.log(err));

    this.feeLoading = true;
    this.api.get(['team', team.id, 'season', this.season_for_fee.id, 'fee'].join('/')).then((feeData: any) => {

      const pdfContent = [];

      const tournament_roster = [];
      const division_header = [];

      const date = new Date();

      const table_body = [];
      const table_width = [];
      const table_header = [];

      const duplicita_table_body = [];
      const duplicita_table_width = [];
      const duplicita_table_header = [];

      let i = 0;
      while (division_header.length > i) {
        i++;
        table_width.push(45);
      }
      table_header.unshift({text: 'Jméno hráče', bold: true});
      table_width.unshift('auto');
      table_header.push({text: 'Poplatek', bold: true});
      table_width.push('auto');

      duplicita_table_header.unshift({text: 'Jméno hráče', bold: true});
      duplicita_table_width.unshift('auto');
      duplicita_table_header.push({text: 'Oddíly hráče', bold: true});
      duplicita_table_width.push('auto');

      const players = [];
      const member2pay = [];

      if (!feeData['fee'][team.name]) {
        alert('Nepodařilo se načíst data, kontaktujte prosím VR ČAU');
        load.dismiss().catch(err => console.log(err));
        this.feeLoading = false;
        return;
      }

      table_body.push(table_header);

      for (const ii in feeData['fee'][team.name].players) {
        const el = feeData['fee'][team.name].players[i];
        if (el) {
          feeData['fee'][team.name].players[ii]['name'] = el['name'].split(' ').reverse().join(' ');
        }
      }

      const sorted = new OrderPipe().transform(feeData['fee'][team.name].players, ['name']);

      for (const iii in sorted) {
        const player = sorted[iii];
        table_body.push([player['name'], player.fee + ' Kč']);
      }

      duplicita_table_body.push(duplicita_table_header);

      if (feeData['duplicate_players']) {
        for (const i in feeData['duplicate_players']) {
          const dup = feeData['duplicate_players'][i];
          let t = [];
          Object.values(dup.teams).forEach(i => {
            t.push(i);
          });
          duplicita_table_body.push([dup.name, t.join(', ')]);
        }
      }

      const data = [{text: 'Česká asociace ultimate', style: 'pageHeader'},
        {
          text: 'Pokyny k zaplacení členských příspěvků ' + ' ' + this.season_for_fee.name,
          style: 'header'
        },
        {text: 'Název oddílu: ' + team.name, bold: true, style: 'list'},
        {text: 'Datum vystavení dokladu: ' + date.toLocaleDateString(), style: 'list'},
        {text: 'Částka: ' + feeData['fee'][team.name].fee + ' Kč', style: 'list'},
        {text: 'Celkem členů platících v sezoně: ' + Object.keys(feeData['fee'][team.name].players).length, style: 'list'},
        {text: 'Číslo účtu: ' + '2201624636/2010', style: 'list'},
        {
          text: 'Variabilní symbol: ' + new Date().getFullYear().toString().substring(2) + '000' + team.id,
          style: 'list'
        },
        {text: 'Členové oddílu povinni zaplatit poplatek', style: 'subHeader'},
        {
          table: {
            headerRows: 1,
            widths: table_width,

            body: table_body
          }
        },
        {
          text: 'Hráči, kteří jsou registrování ve vašem oddíle, ale hráli také za jiný oddíl',
          style: 'subHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: duplicita_table_width,

            body: duplicita_table_body
          }
        }
      ];

      pdfContent.push(data);

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

      load.dismiss().catch(err => console.log(err));

      this.pdfObj = pdfMake.createPdf(docDefinition).download('fee.pdf');

      this.feeLoading = false;
    }, err => {
      this.feeLoading = false;
      alert(err);
    });
  }
}
