import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {GeneralProvider} from '../general/general';
import {ITeam} from '../../interfaces/team';
import {IPlayer} from '../../interfaces/player';
import {ILeague} from '../../interfaces/league';


@Injectable({
  providedIn: 'root'
})
export class PlayerProvider extends GeneralProvider {

  protected code = 'player';

  constructor(public api: ApiProvider) {
    super(api);
  }

  public findById(id): Promise<IPlayer> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((IPlayer) => {
        resolve(IPlayer);
      }, err => {
        reject(err);
      });
    });
  }

  public history(player: IPlayer): Promise<any> {
    return this.api.get('player/' + player.id + '/history');
  }

  public playerAddress(player: IPlayer): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.api.get(['player', player.id, 'address'].join('/')).then(address => {
        resolve(address);
      }, err => {
        console.log(err);
      });
    });
  }

  public updateCreateAddress(player: IPlayer, data): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const pars = [this.code, player.id, 'address'];
      if (data['id']) pars.push(data['id']);
      this.api.post(pars.join('/'), data).then(() => {
        resolve();
      }, err => {
        reject(err);
      });
    });
  }
}
