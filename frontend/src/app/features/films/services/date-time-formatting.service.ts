import { Injectable } from '@angular/core';
import { parse } from 'date-fns';
import { fr } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class DateTimeFormattingService {
  dateFormatting(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  stringDateFormatting(date: string): Date {
    return parse(date, 'd MMMM yyyy', new Date(), { locale: fr });
  }

  dateTimeFormatting(date: Date): string {
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
  }
}
