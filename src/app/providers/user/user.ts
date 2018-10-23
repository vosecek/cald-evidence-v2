import {Injectable} from '@angular/core';
import {GeneralProvider} from '../general/general';
import {ApiProvider} from '../api/api';

@Injectable({
  providedIn: 'root'
})
export class UserProvider extends GeneralProvider {

  protected code = 'user';
  protected updatePut = true;
  protected isAdmin = true;

  constructor(public api: ApiProvider) {
    super(api);
  }

  // public findById(id): Promise<ITournament> {
  //   return new Promise((resolve, reject) => {
  //     super.findById(id).then((ITournament) => {
  //       this.prepareTournamentData(ITournament).then(it => {
  //         resolve(it);
  //       }, err => {
  //         reject(err);
  //       });
  //     }, err => {
  //       reject(err);
  //     });
  //   });
  // }

}
