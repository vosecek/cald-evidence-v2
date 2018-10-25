import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor() {
  }

  static dateConverter(data, property?: string) {
    property = property || 'date';
    if (data[property]) {
      if (data[property]['year']) {
        data[property] = [data[property]['year']['text'], data[property]['month']['text'], data[property]['day']['text']].join('-');
      }
    }

    return data;
  }
}
