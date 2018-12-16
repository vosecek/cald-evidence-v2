import {Pipe, PipeTransform} from '@angular/core';
import {IPlayer} from '../../interfaces/player';

@Pipe({
  name: 'sex'
})
export class SexPipe implements PipeTransform {

  transform(value: IPlayer[], sex): any {
    if (!sex || sex === '0') return value;

    return value.filter(it => it && it.sex === sex);
  }

}
