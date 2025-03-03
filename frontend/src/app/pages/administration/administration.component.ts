import { Component } from '@angular/core';
import { AddFilmComponent } from '../../features/administration/add-film/add-film.component';

@Component({
  selector: 'app-administration',
  imports: [AddFilmComponent],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css',
})
export class AdministrationComponent {}
