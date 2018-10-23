import {Injectable} from '@angular/core';
import {GeneralProvider} from '../general/general';
import {ApiProvider} from '../api/api';
import {ISeason} from '../../interfaces/season';

@Injectable({
  providedIn: 'root'
})
export class SeasonProvider extends GeneralProvider {

  protected code = 'season';

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

}
