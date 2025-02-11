import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-film-form',
  imports: [ReactiveFormsModule],
  templateUrl: './add-film-form.component.html',
  styleUrl: './add-film-form.component.css',
})
export class AddFilmFormComponent {
  addFilmForm = new FormGroup({
    titre: new FormControl(''),
    actors: new FormControl(''),
    description: new FormControl(''),
  });

  addFilm(): void {
    if (this.addFilmForm.invalid) return;
    console.log(this.addFilmForm.value);
  }
}
