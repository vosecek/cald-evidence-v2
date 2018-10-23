import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {GeneralProvider} from '../general/general';
import {IDivision} from '../../interfaces/division';
import {ILeague} from '../../interfaces/league';


@Injectable({
  providedIn: 'root'
})
export class LeagueProvider extends GeneralProvider {

  protected code = 'league';

  constructor(public api: ApiProvider) {
    super(api);
  }

  public findById(id): Promise<ILeague> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((ILeague) => {
        resolve(ILeague);
      }, err => {
        reject(err);
      });
    });
  }

}
