import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'includes'
})
export class IncludesPipe implements PipeTransform {

  transform(source: string, filter: any[]): any[] {
    return filter.find(it => it === source['id']);
  }

}
