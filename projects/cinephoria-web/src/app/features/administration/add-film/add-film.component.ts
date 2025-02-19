import { Component } from '@angular/core';
import { AddFilmFormComponent } from '../../forms/add-film-form/add-film-form.component';

@Component({
  selector: 'app-add-film',
  imports: [AddFilmFormComponent],
  templateUrl: './add-film.component.html',
  styleUrl: './add-film.component.css',
})
export class AddFilmComponent {}
