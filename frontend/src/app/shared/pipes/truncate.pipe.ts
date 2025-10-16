import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: false,
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (typeof value === 'string' && args && typeof args === 'number') {
      return value.length > args ? value.substring(0, args) + '...' : value;
    }
    return value;
  }

}
