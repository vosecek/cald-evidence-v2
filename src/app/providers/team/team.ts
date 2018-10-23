import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {GeneralProvider} from '../general/general';
import {ITeam} from '../../interfaces/team';

@Injectable({
  providedIn: 'root'
})
export class TeamProvider extends GeneralProvider {

  protected code = 'team';

  constructor(public api: ApiProvider) {
    super(api);
  }

  public findById(id): Promise<ITeam> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((ITeam) => {
        resolve(ITeam);
      }, err => {
        reject(err);
      });
    });
  }
}
