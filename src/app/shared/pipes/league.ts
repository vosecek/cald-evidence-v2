import {Pipe, PipeTransform} from '@angular/core';
import {LeagueProvider} from '../../providers/league/league';
import {TournamentBelongsToLeagueAndDivisionProvider} from '../../providers/tournament-belongs-to-league-and-division/tournament-belongs-to-league-and-division';

@Pipe({
  name: 'league',
})
export class LeaguePipe implements PipeTransform {

  constructor(private league: LeagueProvider, private tournamentLD: TournamentBelongsToLeagueAndDivisionProvider) {

  }

  async transform(value) {
    const league = await this.league.findById(value);
    if (!league) { return '??'; }
    return league.name;
  }
}
