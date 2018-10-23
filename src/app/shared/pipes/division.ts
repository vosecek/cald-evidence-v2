import {Pipe, PipeTransform} from '@angular/core';
import {DivisionProvider} from '../../providers/division/division';
import {TournamentBelongsToLeagueAndDivisionProvider} from '../../providers/tournament-belongs-to-league-and-division/tournament-belongs-to-league-and-division';
import {isArray} from 'rxjs/util/isArray';

@Pipe({
  name: 'division',
})
export class DivisionPipe implements PipeTransform {

  constructor(private division: DivisionProvider) {

  }

  async transform(value) {
    if (!isArray(value)) {
      value = [value];
    }

    const division = await this.division.findById(value);
    if (!division) {
      return '??';
    }

    return division.name;
  }
}
