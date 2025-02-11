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

  showFileName(event: any): void {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné
    const fileNameContainer = document.getElementById('file-name-container')!;
    const fileNameElement = document.getElementById('file-name') as HTMLElement;

    if (file) {
      // Affiche le nom du fichier dans l'élément p
      fileNameElement.textContent = file.name;
      // Affiche la zone contenant le nom du fichier
      fileNameContainer.style.display = 'flex';
    }
  }

  addFilm(): void {
    if (this.addFilmForm.invalid) return;
    console.log(this.addFilmForm.value);
  }
}
