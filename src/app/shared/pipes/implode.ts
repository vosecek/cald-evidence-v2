import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'implode',
})
export class ImplodePipe implements PipeTransform {

  transform(value: any[], property: string) {
    if (!value) return '';
    let values = value.map(x => x[property]);
    return values.join(', ');
  }
}
