import {Pipe, PipeTransform} from '@angular/core';
import {TournamentBelongsToLeagueAndDivisionProvider} from '../../providers/tournament-belongs-to-league-and-division/tournament-belongs-to-league-and-division';

@Pipe({
  name: 'tournamentDivisions',
})
export class TournamentDivisionsPipe implements PipeTransform {

  constructor(tournamentLD: TournamentBelongsToLeagueAndDivisionProvider) {

  }

  transform(value: string, ...args) {
    return value.toLowerCase();
  }
}
