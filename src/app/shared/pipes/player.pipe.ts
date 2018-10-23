import {Pipe, PipeTransform} from '@angular/core';
import {isArray} from 'rxjs/util/isArray';
import {PlayerProvider} from '../../providers/player/player';

@Pipe({
  name: 'player'
})
export class PlayerPipe implements PipeTransform {

  constructor(private player: PlayerProvider) {

  }

  async transform(value, property?: string) {
    if (!isArray(value)) {
      value = [value];
    }

    const pl = await this.player.findById(value);
    if (!pl) {
      return '??';
    }

    if (property) {
      return pl[property];
    } else {
      return [pl['last_name'], pl['first_name']].join(' ');
    }
  }

}
