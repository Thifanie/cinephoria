import { Component } from '@angular/core';
import { ListFilmsComponent } from '../../features/films/components/list-films/list-films.component';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-films',
  imports: [ListFilmsComponent, CommonModule, NgFor],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css',
})
export class FilmsComponent {}
