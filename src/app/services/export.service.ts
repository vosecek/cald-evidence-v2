import {ApplicationRef, Injectable} from '@angular/core';
import {ITeam} from '../interfaces/team';
import {IAddress} from '../interfaces/address';
import * as moment from 'moment';
import {saveAs} from 'file-saver';
import {PlayerProvider} from '../providers/player/player';
import {HttpClient} from '@angular/common/http';
import {TeamProvider} from '../providers/team/team';
import {LoadingController, ToastController} from '@ionic/angular';
import {NationalityProvider} from '../providers/nationality/nationality';
import {PlayerAtTeamProvider} from '../providers/player-at-team/player-at-team';
import {FeeProvider} from '../providers/fee/fee';
import {SeasonProvider} from '../providers/season/season';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

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
    this.http.get('./assets/nationalities.json').subscribe((data) => {
      // @ts-ignore
      this.nationalities = data;
    }, err => {
      console.log(err);
      alert(err);
    });
  }

  private nationalities: { id: number, name: string }[] = [];

  async rejstrikSportu(team?: number) {
    console.log(team);
    const csvdata = [];
    const load = await this.loadCtrl.create({});
    load.present().catch(err => console.log(err));

    const promises = [];

    new Promise<any>(async (resolve, reject) => {
      if (team) {
        let t = await this.team.findById(team);
        this.fee.getTeamFee(t, this.season.getCurrentSeason()).then((data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
      } else {
        this.fee.getAllFee(this.season.getCurrentSeason()).then((data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
      }
    }).then(async (data) => {
      let totalPlayers = 0;
      const loadedPlayers = 0;

      const toast = await this.toastCtrl.create({message: 'Načítám adresy hráčů. Chvíli to zabere, dej si kafe.', duration: 3000});
      toast.present();
      this.appRef.tick();

      for (const i in data['fee']) {
        totalPlayers += data['fee'][i]['players'].length;

        promises.push(
          new Promise<any>((resolve, reject) => {
            this.playerAtTeam.load({'team_id': data['fee'][i].id}, true).then(playersData => {

              const teamPromises = [];
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

                        const nat = this.nationalities.find(x => x.name === (it.player.nationality ? it.player.nationality.name : ''));
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
                          '69345368',
                          '',
                          '',
                          '',
                          '98',
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
  }

  downloadFile(data: any) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));

    const h = ['JMENO', 'DALSI_JMENA', 'PRIJMENI', 'DATUM_NAROZENI', 'NAZEV_OBCE', 'NAZEV_CASTI_OBCE', 'NAZEV_ULICE', 'CISLO_POPISNE', 'CISLO_ORIENTACNI', 'PSC', 'STRECHA', 'SVAZ', 'KLUB', 'ODDIL', 'DRUH_SPORTU', 'SPORTOVEC', 'TRENER', 'CLENSTVI_OD', 'CLENSTVI_DO', 'OBCANSTVI', 'EXT_ID'];
    csv.unshift(h.join(';'));
    const csvArray = csv.join('\r\n');

    const blob = new Blob([csvArray], {type: 'text/csv'});
    saveAs(blob, 'rejstrik-sportu.csv');
  }
}
