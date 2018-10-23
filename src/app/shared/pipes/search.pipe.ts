import {Pipe, PipeTransform} from '@angular/core';
import {IPlayer} from '../../interfaces/player';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(data: IPlayer[], val: string): any {
    if (!val || val.length < 2) return data;
    return data.filter(it => {
      return ((it.first_name && it.first_name.indexOf(val) > -1) || (it.last_name && it.last_name.indexOf(val) > -1));
    });
  }

}
