import {Injectable} from '@angular/core';
import {IPlayerAtRoster, IRoster} from '../../interfaces/roster';
import {GeneralProvider} from '../general/general';
import {ApiProvider} from '../api/api';

@Injectable({
  providedIn: 'root'
})
export class PlayerAtRosterProvider extends GeneralProvider {

  protected code = 'player_at_roster';

  constructor(public api: ApiProvider) {
    super(api);
  }

  public findById(id): Promise<IPlayerAtRoster> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((IPlayerAtRoster) => {
        resolve(IPlayerAtRoster);
      }, err => {
        reject(err);
      });
    });
  }
}
