import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarDataExtenso',
  standalone: true,
})
export class FormatarDataExtensoPipe implements PipeTransform {

  transform(value: Date | string): string {
    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('pt-BR', options);
  }
}
