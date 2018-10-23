import {Component, OnInit} from '@angular/core';
import {AuthProvider} from '../providers/auth/auth';
import {ApiProvider} from '../providers/api/api';
import {ITeam} from '../interfaces/team';
import {SeasonProvider} from '../providers/season/season';
import {OrderPipe} from '../shared/pipes/order';
import {TeamProvider} from '../providers/team/team';
import {TeamPipe} from '../shared/pipes/team.pipe';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import {File} from '@ionic-native/file';
// import {FileOpener} from '@ionic-native/file-opener';
import {LoadingController, Platform} from '@ionic/angular';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  protected feeLoading = false;
  fee_season: any;
  protected teams: ITeam[] = [];

  pdfObj = null;

  constructor(
    // private file: File, private fileOpener: FileOpener,
    private platform: Platform,
    private loadCtrl: LoadingController,
    private authProvider: AuthProvider, private api: ApiProvider, private season: SeasonProvider, private teamProvider: TeamProvider) {
  }

  protected showFee(): boolean {
    const date = new Date();
    if (this.feeLoading === true) return false;
    return (date.getMonth() > 8);
  }

  ngOnInit() {
    this.fee_season = new OrderPipe().transform(this.season.data, ['-name'])[0];

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

  async getFee(team: ITeam): void {

    let load = await this.loadCtrl.create();
    load.present().catch(err => console.log(err));

    this.feeLoading = true;
    this.api.get(['team', team.id, 'season', this.fee_season.id, 'fee'].join('/')).subscribe((feeData: any) => {

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
        alert('Nepodařilo se načíst data, kontaktujte prosím VR ČALD');
        this.feeLoading = false;
        return;
      }

      table_body.push(table_header);

      feeData['fee'][team.name].players.forEach((el, i) => {
        console.log(el);
        if (el) {
          feeData['fee'][team.name].players[i] = el['name'].split(' ').reverse().join(' ');
        }
      });

      feeData['fee'][team.name].players = feeData['fee'][team.name].players.sort();

      feeData['fee'][team.name].players.forEach(player => {
        table_body.push([player, '400 Kč']);
      });

      duplicita_table_body.push(duplicita_table_header);

      if (feeData['duplicate_players']) {
        for (const i in feeData['duplicate_players']) {
          const dup = feeData['duplicate_players'][i];
          duplicita_table_body.push([dup.name, dup.teams.join(', ')]);
        }
      }

      const data = [{text: 'Česká asociace létajícího disku', style: 'pageHeader'},
        {
          text: 'Pokyny k zaplacení členských příspěvků ' + ' ' + this.fee_season.name,
          style: 'header'
        },
        {text: 'Název oddílu: ' + team.name, bold: true, style: 'list'},
        {text: 'Datum vystavení dokladu: ' + date.toLocaleDateString(), style: 'list'},
        {text: 'Částka: ' + feeData['fee'][team.name].fee + ' Kč', style: 'list'},
        {text: 'Celkem členů platících v sezoně: ' + feeData['fee'][team.name].players.length, style: 'list'},
        {text: 'Číslo účtu: ' + '233012651/0300', style: 'list'},
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

      // this.downloadPdf();

      this.feeLoading = false;
    }, err => {
      this.feeLoading = false;
      alert(err);
    });
  }

  // downloadPdf() {
  //   if (this.platform.is('cordova')) {
  //     this.pdfObj.getBuffer((buffer) => {
  //       var blob = new Blob([buffer], {type: 'application/pdf'});
  //
  //       // Save the PDF to the data Directory of our App
  //       this.file.writeFile(this.file.dataDirectory, 'fee.pdf', blob, {replace: true}).then(fileEntry => {
  //         // Open the PDf with the correct OS tools
  //         this.fileOpener.open(this.file.dataDirectory + 'fee.pdf', 'application/pdf');
  //       });
  //     });
  //   } else {
  //     // On a browser simply use download!
  //     this.pdfObj.download();
  //   }
  // }
}
