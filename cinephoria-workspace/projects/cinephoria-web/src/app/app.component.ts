import { Component } from '@angular/core';
import { NavComponent } from './features/menus/nav/nav.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './features/menus/footer/footer.component';
import { AdministrationComponent } from './pages/administration/administration.component';

@Component({
  selector: 'app-root',
  imports: [
    NavComponent,
    RouterOutlet,
    FooterComponent,
    AdministrationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cinephoria-web';
}
