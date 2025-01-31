import { Component } from '@angular/core';
import { Film } from '../../models/film';

@Component({
  selector: 'app-list-films',
  imports: [],
  templateUrl: './list-films.component.html',
  styleUrl: './list-films.component.css',
})
export class ListFilmsComponent {
  film: Film[] = [];
}
