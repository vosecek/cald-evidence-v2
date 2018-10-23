import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {GeneralProvider} from '../general/general';
import {ITournamentBelongsToLeagueAndDivision} from '../../interfaces/tournament';
import {ILeague} from '../../interfaces/league';


@Injectable({
  providedIn: 'root'
})
export class TournamentBelongsToLeagueAndDivisionProvider extends GeneralProvider {

  protected code = 'tournament_belongs_to_league_and_division';

  constructor(public api: ApiProvider) {
    super(api);
  }

  public byTournament(tournamentId): Promise<ITournamentBelongsToLeagueAndDivision[]> {
    return new Promise<any>((resolve, reject) => {
      this.loadDataByMaster('tournament_id', tournamentId).then((data) => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  public findById(id): Promise<ITournamentBelongsToLeagueAndDivision> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((ITournamentBelongsToLeagueAndDivision) => {
        resolve(ITournamentBelongsToLeagueAndDivision);
      }, err => {
        reject(err);
      });
    });
  }

}
