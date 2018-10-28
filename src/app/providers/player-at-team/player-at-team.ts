import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {GeneralProvider} from '../general/general';
import {IPlayerAtTeam} from '../../interfaces/player-at-team';
import {IPlayer} from '../../interfaces/player';
import {ITeam} from '../../interfaces/team';
import {ISeason} from '../../interfaces/season';


@Injectable({
  providedIn: 'root'
})
export class PlayerAtTeamProvider extends GeneralProvider {

  protected code = 'player_at_team';

  constructor(public api: ApiProvider) {
    super(api);
  }

  public findById(id): Promise<IPlayerAtTeam> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((IPlayerAtTeam) => {
        resolve(IPlayerAtTeam);
      }, err => {
        reject(err);
      });
    });
  }

  assignPlayerToTeam(player: IPlayer, team: ITeam, season: ISeason): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const pars = ['team'];
      pars.push(team.id);
      pars.push('player');
      pars.push(player.id);

      this.api.post(pars.join('/'), {season_id: season.id}).then(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  removePlayerFromTeam(player: IPlayer, team: ITeam, season: ISeason): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const pars = ['team'];
      pars.push(team.id);
      pars.push('player');
      pars.push(player.id);

      this.api.delete(pars.join('/'), {season_id: season.id}).then(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }
}
