import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardFilmsComponent } from './features/films/components/card-films/card-films.component';
import { ListFilmsComponent } from './features/films/components/list-films/list-films.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CardFilmsComponent, ListFilmsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cinephoria-web';
}
