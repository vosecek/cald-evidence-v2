import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {GeneralProvider} from '../general/general';
import {INationality} from '../../interfaces/nationality';


@Injectable({
  providedIn: 'root'
})
export class NationalityProvider extends GeneralProvider {

  protected code = 'nationality';

  constructor(public api: ApiProvider) {
    super(api);
  }

  public findById(id): Promise<any> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((INationality) => {
        resolve(INationality);
      }, err => {
        reject(err);
      });
    });
  }

}
