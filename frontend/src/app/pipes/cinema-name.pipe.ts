import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cinemaName',
})
export class CinemaNamePipe implements PipeTransform {
  transform(value: string): string {
    const cinemaNamesMap: { [key: string]: string } = {
      'Le Multivers Cinéma': 'au Multivers Cinéma',
      'Bêtes de cinéma': 'à Bêtes de cinéma',
      'Le Cinéma du Matin Calme': 'au Cinéma du Matin Calme',
    };

    return cinemaNamesMap[value] || value; // Retourne le nom modifié ou la valeur originale si inconnue
  }
}
