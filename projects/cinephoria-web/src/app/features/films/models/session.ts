/** Une séance de film */

export interface Session {
  id: number;
  date: Date;
  filmTitle: string;
  formatedDate: string;
  startHour: string;
  formatedStartHour: string;
  endHour: string;
  formatedEndHour: string;
  idFilm: number;
  cinemaName: string;
  roomName: string;
  quality: string | undefined;
  price: number | undefined;
  moviePoster: string;
}
