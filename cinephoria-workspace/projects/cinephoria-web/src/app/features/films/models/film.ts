/** Un film géré dans la filmothèque */

export interface Film {
  id: number;
  title: string;
  actors: string;
  description: string;
  minage: number;
  favorite: boolean;
  opinion: number;
  movieposter: string;
  onview: boolean;
  type: number[];
}

export interface FilmData {
  title: string;
  actors: string;
  description: string;
  minAge: number;
  favorite: boolean;
  opinion: number;
  moviePoster: string;
  onView: boolean;
  type: number[];
}
