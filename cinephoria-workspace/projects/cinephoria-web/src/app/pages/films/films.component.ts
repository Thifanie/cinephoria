import { Component } from '@angular/core';
import { ListFilmsComponent } from '../../features/films/components/list-films/list-films.component';

@Component({
  selector: 'app-films',
  imports: [ListFilmsComponent],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css',
})
export class FilmsComponent {}
