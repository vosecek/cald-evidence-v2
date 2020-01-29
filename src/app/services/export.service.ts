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
import {TournamentProvider} from '../providers/tournament/tournament';
import {AuthProvider} from '../providers/auth/auth';
import {ITournament, ITournamentBelongsToLeagueAndDivision} from '../interfaces/tournament';
import {IPlayer} from '../interfaces/player';
import {RosterProvider} from '../providers/roster/roster';
import {TournamentBelongsToLeagueAndDivisionProvider} from '../providers/tournament-belongs-to-league-and-division/tournament-belongs-to-league-and-division';
import {IRoster} from '../interfaces/roster';
import {PlayerAtRosterProvider} from '../providers/player-at-roster/player-at-roster';
import {DivisionProvider} from '../providers/division/division';
import {IDivision} from '../interfaces/division';
import {ISeason} from '../interfaces/season';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(
    private player: PlayerProvider,
    private http: HttpClient,
    private tournament: TournamentProvider,
    private team: TeamProvider,
    private toastCtrl: ToastController,
    private playerAtRoster: PlayerAtRosterProvider,
    private nationalityService: NationalityProvider,
    private appRef: ApplicationRef,
    private tournamentInDivision: TournamentBelongsToLeagueAndDivisionProvider,
    private playerAtTeam: PlayerAtTeamProvider,
    private fee: FeeProvider,
    private rosters: RosterProvider,
    private division: DivisionProvider,
    private authProvider: AuthProvider,
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

  private alphabetPosition(text) {
    var result = '';
    for (var i = 0; i < text.length; i++) {
      var code = text.toUpperCase().charCodeAt(i);
      if (code > 64 && code < 91) result += (code - 64) + ' ';
    }

    return result.slice(0, result.length - 1);
  }

  async catcher(type: string) {
    this.authProvider.login({
      login: 'public',
      password: 'access'
    }).then(() => {
      const csvdata = [];


      if (type === 'tournament') {
        csvdata.push(['ID turnaje', 'Název', 'Místo', 'Datum']);
        this.season.load().then(() => {
          this.tournament.load().then(data => {
            data.forEach((el: ITournament) => {
              if (moment(el.date) > moment()) {
                csvdata.push([el.id, el.name, el.location, moment(el.date).format('DD.MM.YYYY')]);
              }
            });
            console.log(csvdata);
            this.catcherDownload(csvdata);
          });
        }, err => {
          console.log(err);
        });
      } else if (type === 'rosters') {

        csvdata.push(['ID turnaje', 'Název', 'ID Oddílu', 'Oddíl', 'Tým', 'ID hráče', 'Příjmení', 'Jméno']);

        const promises = [];

        Promise.all([
          this.player.load(),
          this.season.load(),
          this.tournament.load(),
          this.division.load(),
          this.team.load()
        ]).then((data) => {
          data[2].forEach((el: ITournament) => {
            if (moment(el.date) > moment()) {
              promises.push(new Promise<any>((resolve, reject) => {
                this.tournamentInDivision.byTournament(el.id).then((tbld: ITournamentBelongsToLeagueAndDivision[]) => {
                  tbld.forEach(tb => {
                    this.rosters.tournamentRoster(parseInt(tb.id, 10)).then((rosters: IRoster[]) => {

                      let promises3 = []; // na nacteni hracu na soupisce
                      rosters.forEach(r => {
                        promises3.push(new Promise<any>((resolve, reject) => {
                          let team: ITeam = this.team.data.find(e => e.id == r.team_id);

                          if (team) {
                            this.playerAtRoster.loadDataByMaster('roster_id', r.id, {}, true).then(players => {
                              console.log(players);
                              players.forEach(p => {
                                let div = this.division.data.find((e: IDivision) => e.id == tb.division_id);
                                if (div) {
                                  csvdata.push([tb.id, el.name, r.team_id, team.name, div.name + (r.name.length > 0 ? this.alphabetPosition(r.name) : ''), p.player.id, p.player.last_name, p.player.first_name]);
                                }
                              });
                              resolve();
                            }, err => {
                              console.log(err);
                              resolve();
                            });
                          } else {
                            resolve();
                          }
                        }));
                      });

                      Promise.all(promises3).then(() => {
                        resolve();
                      }, err => {
                        console.log(err);
                      });
                    }, err => {

                    });
                  });
                }, err => {
                  console.log(err);
                });
              }));
            }
          });

          Promise.all(promises).then(() => {
            console.log(csvdata);
            this.catcherDownload(csvdata);
          }, err => {
            console.log(err);
          });

        }, err => {

        });
      } else if (type === 'players') {

        Promise.all([
          this.playerAtTeam.load(),
          this.player.load(),
          this.team.load()
        ]).then((data) => {
          csvdata.push(['ID oddilu', 'Oddil', 'ID hrace', 'Prijmeni', 'Jmeno']);
          data[1].forEach((el: IPlayer) => {
            let playerAtTeam = data[0].find(e => e.player_id == el.id);

            if (playerAtTeam) {
              let team: ITeam = this.team.data.find(it => it.id == playerAtTeam.team_id);

              if (team) {
                csvdata.push([team.id, team.name, el.id, el.last_name, el.first_name]);
                console.log([team.id, team.name, el.id, el.last_name, el.first_name]);
              }
            }
          });
          this.catcherDownload(csvdata);
        }, err => {
          console.log(err);
        });
      } else {
        console.log('unknown type');
      }


    });
  }

  async rejstrikSportu(team?: number, season?: ISeason, includeTeamName?: boolean) {
    const csvdata = [];
    const load = await this.loadCtrl.create({});
    load.present().catch(err => console.log(err));

    if (!season) {
      season = this.season.getCurrentSeason();
    }

    const promises = [];

    new Promise<any>(async (resolve, reject) => {
      if (team) {
        let t = await this.team.findById(team);
        this.fee.getTeamFee(t, season).then((data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
      } else {
        this.fee.getAllFee(season).then((data) => {
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
        totalPlayers += Object.keys(data['fee'][i]['players']).length;

        promises.push(
          new Promise<any>((resolve, reject) => {
            this.playerAtTeam.load({'team_id': data['fee'][i].id}, true).then(playersData => {

              const teamPromises = [];
              playersData.forEach(it => {
                // @ts-ignore
                if (!Object.values(data['fee'][i].players).find(el => el.id == it.player.id)) {

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

                        const nat = this.nationalities.find(x => x.name === (it.player.nationality ? it.player.nationality.name : ''));
                        if (nat) {
                          nationality = nat.id;
                        }

                        let data = [
                          it.player.first_name,
                          '',
                          it.player.last_name,
                          it.player.personal_identification_number,
                          nationality,
                          moment(it.player.birth_date).format('DD.MM.YYYY'),
                          '1',
                          '0',
                          moment(it.player.created_at).format('YYYY'),
                          '0',
                          '0',
                          '0',
                          address.city,
                          address.district,
                          address.street,
                          address.descriptive_number,
                          address.orientation_number,
                          address.zip_code,
                          '98',
                          it.player.id
                        ];

                        if (includeTeamName) data.push(it.team.name);

                        csvdata.push(data);
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
        this.downloadFile(csvdata, includeTeamName);
        load.dismiss().catch(err => console.log(err));
      }, err => {
        load.dismiss().catch(err => console.log(err));
      });
    });
  }

  catcherDownload(data) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map(row => header.map(fieldName => row[fieldName], replacer).join('\t'));

    const csvArray = csv.join('\r\n');

    const blob = new Blob([csvArray], {type: 'text/csv'});
    saveAs(blob, 'catcher-data.csv');
  }

  downloadFile(data: any, includeTeamName: boolean) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));


    let h = ['JMENO', 'DALSI_JMENA', 'PRIJMENI', 'RODNE_CISLO', 'OBCANSTVI', 'DATUM_NAROZENI', 'SPORTOVEC', 'TRENER', 'SPORTOVCEM_OD', 'SPORTOVCEM_DO', 'TRENEREM_OD', 'TRENEREM_DO', 'NAZEV_OBCE', 'NAZEV_CASTI_OBCE', 'NAZEV_ULICE', 'CISLO_POPISNE', 'CISLO_ORIENTACNI', 'PSC	', 'DRUH_SPORTU', '	EXT_ID'];
    if (includeTeamName) h.push('ODDIL');
    // const h = ['JMENO', 'DALSI_JMENA', 'PRIJMENI', 'DATUM_NAROZENI', 'NAZEV_OBCE', 'NAZEV_CASTI_OBCE', 'NAZEV_ULICE', 'CISLO_POPISNE', 'CISLO_ORIENTACNI', 'PSC', 'STRECHA', 'SVAZ', 'KLUB', 'ODDIL', 'DRUH_SPORTU', 'SPORTOVEC', 'TRENER', 'CLENSTVI_OD', 'CLENSTVI_DO', 'OBCANSTVI', 'EXT_ID', 'ODDIL'];
    csv.unshift(h.join(';'));
    const csvArray = csv.join('\r\n');

    const blob = new Blob([csvArray], {type: 'text/csv'});
    saveAs(blob, 'rejstrik-sportu.csv');
  }
}
