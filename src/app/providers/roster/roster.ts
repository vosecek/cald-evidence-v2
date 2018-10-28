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

  constructor(public api: ApiProvider) {
    super(api);
  }

  public tournamentRoster(tournamentId: number): Promise<IRoster> {
    return new Promise<any>((resolve, reject) => {
      super.load({tournament_id: tournamentId}).then((data) => {
        console.log(data);
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
        reject(err);
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
        reject(err);
      });
    });
  }
}
