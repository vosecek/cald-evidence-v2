import {Moment} from 'moment';
import {ILeague} from './league';
import {IDivision} from './division';

export interface ITournamentBelongsToLeagueAndDivision {
  id: string;
  division_id: string;
  league_id: string;
  tournament_id: string;
}

export interface ITournament {
  date: Moment;
  deleted: string;
  duration: string;
  id: string;
  ld: ITournamentBelongsToLeagueAndDivision[];
  leagues: ILeague[];
  divisions: IDivision[];
  division_ids: number[];
  league_ids: number[];
  location: string;
  name: string;
  organizing_team_id: string;
  season_id: string;
}
