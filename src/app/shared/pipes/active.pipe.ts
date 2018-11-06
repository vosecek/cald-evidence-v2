import {Pipe, PipeTransform} from '@angular/core';
import {IPlayer} from '../../interfaces/player';

@Pipe({
  name: 'active'
})
export class ActivePipe implements PipeTransform {

  transform(players: IPlayer[], activePlayers: IPlayer[], active: string): any {
    if (active === '0') {
      console.log('display all');
      return players;
    }

    const ids = activePlayers.map(i => i.id);
    return players.filter(it => ids.find(e => e == it.id));
  }

}
