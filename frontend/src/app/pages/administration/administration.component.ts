import { Component } from '@angular/core';
import { AddFilmComponent } from '../../features/administration/add-film/add-film.component';
import { UpdateFilmComponent } from '../../features/administration/update-film/update-film.component';

@Component({
  selector: 'app-administration',
  imports: [AddFilmComponent, UpdateFilmComponent],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css',
})
export class AdministrationComponent {}
