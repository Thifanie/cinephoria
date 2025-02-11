/** Un film géré dans la filmothèque */

export interface Film {
  id: number;
  title: string;
  actors: string;
  description: string;
  minAge: number;
  favorite: boolean;
  opinion: number;
  moviePoster: string;
  onView: boolean;
}
