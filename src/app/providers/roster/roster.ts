import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {GeneralProvider} from '../general/general';
import {IRoster} from '../../interfaces/roster';
import {IPlayer} from '../../interfaces/player';


@Injectable({
  providedIn: 'root'
})
export class RosterProvider extends GeneralProvider {

  protected code = 'roster';
  protected updatePut = true;

  constructor(public api: ApiProvider) {
    super(api);
  }

  public open(roster: IRoster): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.api.post('/roster/' + roster.id + '/open').then((data) => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  public finalize(roster: IRoster): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.api.post('/roster/' + roster.id + '/finalize').then((data) => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  public tournamentRoster(subTournament_id: number): Promise<IRoster[]> {
    return new Promise<any>((resolve, reject) => {
      super.load({tournament_belongs_to_league_and_division_id: subTournament_id}).then((data) => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  public findById(id): Promise<IRoster> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((IRoster) => {
        resolve(IRoster);
      }, err => {
        reject(err);
      });
    });
  }

  public removePlayerFromRoster(player: IPlayer, roster: IRoster): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const pars = [];
      pars.push(this.code);
      pars.push(roster.id);
      pars.push('player');
      pars.push(player.id);

      this.api.delete(pars.join('/')).then(data => {
        resolve(data);
      }, err => {
        reject('Chyba při ukládání do soupisky, hráč již zřejmě na některé soupisce je');
      });
    });
  }


  public addPlayerToRoster(player: IPlayer, roster: IRoster): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const pars = [];
      pars.push(this.code);
      pars.push(roster.id);
      pars.push('player');
      pars.push(player.id);

      this.api.post(pars.join('/')).then(data => {
        resolve(data);
      }, err => {
        reject('Chyba při ukládání do soupisky, hráč již zřejmě na některé soupisce je');
      });
    });
  }
}
