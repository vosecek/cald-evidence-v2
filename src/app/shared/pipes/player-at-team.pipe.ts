import {Pipe, PipeTransform} from '@angular/core';
import {PlayerAtTeamProvider} from '../../providers/player-at-team/player-at-team';
import {TeamProvider} from '../../providers/team/team';
import {IPlayer} from '../../interfaces/player';

@Pipe({
  name: 'playerAtTeam'
})
export class PlayerAtTeamPipe implements PipeTransform {

  constructor(private playerAtTeam: PlayerAtTeamProvider, private team: TeamProvider) {

  }

  transform(value: IPlayer): string {
    const pat = this.playerAtTeam.data.find(it => it.player_id === value.id);
    if (!pat) {
      return '??';
    }
    const team = this.team.getById(pat.team_id);
    if (team) {
      return team.name;
    } else {
      return '??';
    }
  }

}
