import {Injectable} from '@angular/core';
import {GeneralProvider} from '../general/general';
import {ApiProvider} from '../api/api';
import {ITournament, ITournamentBelongsToLeagueAndDivision} from '../../interfaces/tournament';
import {TournamentBelongsToLeagueAndDivisionProvider} from '../tournament-belongs-to-league-and-division/tournament-belongs-to-league-and-division';

import * as moment from 'moment';
import {DivisionProvider} from '../division/division';
import {LeagueProvider} from '../league/league';
import {AuthProvider} from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class TournamentProvider extends GeneralProvider {

  protected code = 'tournament';
  protected isAdmin = true;
  protected updatePut = true;

  constructor(public api: ApiProvider,
              private tournamentBLD: TournamentBelongsToLeagueAndDivisionProvider,
              private divisionProvider: DivisionProvider,
              private auth: AuthProvider,
              private leagueProvider: LeagueProvider) {
    super(api);
  }

  isUserTournamentAdmin(tournament): boolean {
    if (this.auth.user.isAdmin()) {
      return true;
    }
    return (tournament.organizing_team_id == this.auth.user.user.id);
  }

  public prepareTournamentData(it): Promise<ITournament> {
    return new Promise<any>((resolve, reject) => {
      this.tournamentBLD.byTournament(it.id).then((ld: ITournamentBelongsToLeagueAndDivision[]) => {
        ld.forEach(el => {
          if (!it.leagues) {
            it.leagues = [];
          }
          if (!it.divisions) {
            it.divisions = [];
          }

          const division = this.divisionProvider.getById(el.division_id);
          const league = this.leagueProvider.getById(el.league_id);

          if (it.divisions.indexOf(division) < 0) {
            it.divisions.push(division);
          }
          if (it.leagues.indexOf(league) < 0) {
            it.leagues.push(league);
          }
        });

        it.ld = ld;
        it.date = moment(it.date);
        resolve(it);
      }, err => {
        reject(err);
      });
    });
  }

  public tournamentsBySeason(season_id): Promise<ITournament[]> {
    return new Promise<any>((resolve, reject) => {
      this.loadDataByMaster('season_id', season_id).then((data) => {
        const promises = [];
        data.forEach((it: ITournament) => {
          promises.push(this.prepareTournamentData(it));
        });

        Promise.all(promises).then((items) => {
          resolve(items);
        }, err => {
          reject(err);
        });
      }, err => {
        reject(err);
      });
    });
  }

  public findById(id): Promise<ITournament> {
    return new Promise((resolve, reject) => {
      super.findById(id).then((ITournament) => {
        this.prepareTournamentData(ITournament).then(it => {
          resolve(it);
        }, err => {
          reject(err);
        });
      }, err => {
        reject(err);
      });
    });
  }

}
