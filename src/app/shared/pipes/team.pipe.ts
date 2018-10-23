import {Pipe, PipeTransform} from '@angular/core';
import {TeamProvider} from '../../providers/team/team';
import {isArray} from 'rxjs/util/isArray';

@Pipe({
  name: 'team'
})
export class TeamPipe implements PipeTransform {

  constructor(private team: TeamProvider) {

  }

  async transform(value, property?: string) {
    if (!isArray(value)) {
      value = [value];
    }

    const team = await this.team.findById(value);
    if (!team) {
      return '??';
    }

    return team[(property ? property : 'name')];
  }

}
