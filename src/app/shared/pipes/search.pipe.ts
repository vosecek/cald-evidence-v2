import {Pipe, PipeTransform} from '@angular/core';
import {IPlayer} from '../../interfaces/player';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(data: IPlayer[], val: string): any {
    if (!val || val.length < 2) return data;
    val = val.toLowerCase();
    return data.filter(it => {
      return ((it.first_name && it.first_name.toLowerCase() && it.first_name.toLowerCase().indexOf(val) > -1) || (it.last_name && it.last_name.toLowerCase() && it.last_name.toLowerCase().indexOf(val) > -1));
    });
  }

}
