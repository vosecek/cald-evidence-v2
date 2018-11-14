import {Injectable} from '@angular/core';
import {GeneralProvider} from '../general/general';
import {ApiProvider} from '../api/api';
import {ISeason} from '../../interfaces/season';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SeasonProvider extends GeneralProvider {

  protected code = 'season';
  protected updatePut = true;

  constructor(public api: ApiProvider) {
    super(api);
  }

  public findById(id): Promise<ISeason> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((ISeason) => {
        resolve(ISeason);
      }, err => {
        reject(err);
      });
    });
  }

  public getCurrentSeason(): ISeason {
    return this.data.find(it => it.name == moment().format('YYYY'));
  }
}
