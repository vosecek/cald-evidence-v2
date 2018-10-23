import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {GeneralProvider} from '../general/general';
import {IDivision} from '../../interfaces/division';
import {ILeague} from '../../interfaces/league';


@Injectable({
  providedIn: 'root'
})
export class DivisionProvider extends GeneralProvider {

  protected code = 'division';

  constructor(public api: ApiProvider) {
    super(api);
  }

  public findById(id): Promise<IDivision> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((IDivision) => {
        resolve(IDivision);
      }, err => {
        reject(err);
      });
    });
  }

}
