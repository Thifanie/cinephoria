import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-film',
  imports: [ReactiveFormsModule],
  templateUrl: './add-film.component.html',
  styleUrl: './add-film.component.css',
})
export class AddFilmComponent {
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
