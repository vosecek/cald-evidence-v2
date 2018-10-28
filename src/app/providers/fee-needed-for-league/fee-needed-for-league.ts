import {Injectable} from '@angular/core';
import {IPlayerAtRoster, IRoster} from '../../interfaces/roster';
import {GeneralProvider} from '../general/general';
import {ApiProvider} from '../api/api';

@Injectable({
  providedIn: 'root'
})
export class FeeNeededForLeagueProvider extends GeneralProvider {

  protected code = 'fee_needed_for_league';

  constructor(public api: ApiProvider) {
    super(api);
  }
}
