import { Injectable } from '@angular/core';

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
