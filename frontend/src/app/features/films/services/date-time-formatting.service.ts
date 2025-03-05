import { Injectable } from '@angular/core';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root',
})
export class DateTimeFormattingService {
  // dateFormatting(listSessions: Session[]) {
  //   listSessions.forEach(
  //     (session: Session) => (session.date = new Date(session.date))
  //   );
  //   listSessions.forEach(
  //     (session) =>
  //       (session.formatedDate = session.date.toLocaleDateString('fr-FR', {
  //         day: 'numeric',
  //         month: 'long',
  //         year: 'numeric',
  //       }))
  //   );
  // }

  dateTimeFormatting(date: Date) {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // startHourFormatting(listSessions: Session[]) {
  //   listSessions.forEach(
  //     (session) => (session.formatedStartHour = session.startHour.slice(0, 5))
  //   );
  // }

  // endHourFormatting(listSessions: Session[]) {
  //   listSessions.forEach(
  //     (session) => (session.formatedEndHour = session.endHour.slice(0, 5))
  //   );
  // }
}
