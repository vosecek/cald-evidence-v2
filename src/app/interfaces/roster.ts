import {IPlayer} from './player';

export interface IPlayerAtRoster {
  id: string;
  player_id: string;
  roster_id: string;
  player?: IPlayer;
}

export interface IRoster {
  final_result: string;
  id: string;
  seeding: string;
  finalized: any;
  team_id: string;
  team_name?: string;
  tournament_belongs_to_league_and_division_id: string;
  player_at_roster: IPlayerAtRoster[];
}

export class Roster {
}
