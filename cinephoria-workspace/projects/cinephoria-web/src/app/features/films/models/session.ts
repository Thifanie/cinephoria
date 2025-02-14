/** Une séance de film */

export interface Session {
  id: number;
  date: Date;
  startHour: Date;
  endHour: Date;
  idFilm: number;
  idCinema: number;
  idRoom: number;
}
