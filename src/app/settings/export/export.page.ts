import {ApplicationRef, Component, OnInit} from '@angular/core';
import {PlayerProvider} from '../../providers/player/player';
import {TeamProvider} from '../../providers/team/team';
import {FeeProvider} from '../../providers/fee/fee';
import {ITeam} from '../../interfaces/team';
import {SeasonProvider} from '../../providers/season/season';
import {LoadingController, ToastController} from '@ionic/angular';
import {ISeason} from '../../interfaces/season';
import {IPlayer} from '../../interfaces/player';
import {PlayerAtTeamProvider} from '../../providers/player-at-team/player-at-team';
import * as moment from 'moment';
import {IAddress} from '../../interfaces/address';
import {HttpClient} from '@angular/common/http';

import {saveAs} from 'file-saver';
import {NationalityProvider} from '../../providers/nationality/nationality';

@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
})
export class ExportPage implements OnInit {

  constructor(
    private player: PlayerProvider,
    private http: HttpClient,
    private team: TeamProvider,
    private toastCtrl: ToastController,
    private nationalityService: NationalityProvider,
    private appRef: ApplicationRef,
    private playerAtTeam: PlayerAtTeamProvider,
    private fee: FeeProvider,
    private loadCtrl: LoadingController,
    private season: SeasonProvider
  ) {
  }

  private nationalities: { id: number, name: string }[] = [];

  ngOnInit() {
    this.http.get('./assets/nationalities.json').subscribe((data) => {
      // @ts-ignore
      this.nationalities = data;
    }, err => {
      console.log(err);
      alert(err);
    });
    console.log(this.nationalityService.data);
  }

  async rejstrikSportu() {
    let csvdata = [];
    const load = await this.loadCtrl.create({});
    load.present().catch(err => console.log(err));

    const promises = [];

    this.fee.getAllFee(this.season.getCurrentSeason()).then(async (data) => {
      console.log('fees downloaded');
      let totalPlayers = 0;
      let loadedPlayers = 0;

      const toast = await this.toastCtrl.create({message: 'Načítám adresy hráčů. Chvíli to zabere, dej si kafe.', duration: 3000});
      toast.present();
      this.appRef.tick();

      for (const i in data['fee']) {
        totalPlayers += data['fee'][i]['players'].length;

        promises.push(
          new Promise<any>((resolve, reject) => {
            console.log('called for player in team ' + data['fee'][i].id);
            this.playerAtTeam.load({'team_id': data['fee'][i].id}, true).then(playersData => {

              const teamPromises = [];
              console.log('team playersData received');
              playersData.forEach(it => {
                if (!data['fee'][i].players.find(el => el.id == it.player.id)) {
                  console.log('not active player');
                } else {
                  teamPromises.push(
                    new Promise<any>((resolve) => {
                      this.player.playerAddress(it.player).then((address_data) => {
                        let address: IAddress = {
                          id: '',
                          country: '',
                          player_id: '',
                          type: '',
                          city: '',
                          district: '',
                          street: '',
                          descriptive_number: '',
                          orientation_number: '',
                          zip_code: ''
                        };
                        if (address_data.length > 0) {
                          if (address_data[0]) {
                            address = address_data[0];
                          }
                        }

                        let nationality = 0;
                        console.log(it.player);

                        let nat = this.nationalities.find(x => x.name === (it.player.nationality ? it.player.nationality.name : ''));
                        if (nat) {
                          nationality = nat.id;
                        }

                        csvdata.push([
                          it.player.first_name,
                          '',
                          it.player.last_name,
                          moment(it.player.birth_date).format('D.M.YYYY'),
                          address.city,
                          address.district,
                          address.street,
                          address.descriptive_number,
                          address.orientation_number,
                          address.zip_code,
                          '',
                          '',
                          '08057508',
                          '',
                          '0',
                          '1',
                          '0',
                          moment(it.player.created_at).format('YYYY'),
                          '',
                          nationality,
                          it.player.id
                        ]);
                        resolve();
                      }, err => {
                        console.log(err);
                        resolve();
                      });
                    })
                  );
                }
              });

              Promise.all(teamPromises).then(() => {
                resolve();
              }, err => {
                console.log(err);
                resolve();
              });

            }, err => {
              alert(err);
              resolve();
            });
          })
        );
      }

      Promise.all(promises).then(() => {
        console.log(csvdata);
        this.downloadFile(csvdata);
        load.dismiss().catch(err => console.log(err));
      }, err => {
        load.dismiss().catch(err => console.log(err));
      });
    });

    // this.team.data.forEach((el: ITeam) => {
    //   console.log(el);

    // promises.push(
    //   new Promise<any>((resolve, reject) => {
    //     console.log(this.season.getCurrentSeason());
    //     this.fee.getTeamFee(el, this.season.data.find((it: ISeason) => it.id === '10')).then((data) => {
    //       console.log(data);
    //       resolve();
    //     }, err => {
    //       console.log(err);
    //       resolve();
    //     });
    //   })
    // );
    // });
  }

  downloadFile(data: any) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));

    let h = ['JMENO', 'DALSI_JMENA', 'PRIJMENI', 'DATUM_NAROZENI', 'NAZEV_OBCE', 'NAZEV_CASTI_OBCE', 'NAZEV_ULICE', 'CISLO_POPISNE', 'CISLO_ORIENTACNI', 'PSC', 'STRECHA', 'SVAZ', 'KLUB', 'ODDIL', 'DRUH_SPORTU', 'SPORTOVEC', 'TRENER', 'CLENSTVI_OD', 'CLENSTVI_DO', 'OBCANSTVI', 'EXT_ID'];
    csv.unshift(h.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv'});
    saveAs(blob, 'rejstrik-sportu.csv');
  }

}
