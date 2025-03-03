import { Component } from '@angular/core';
import { NavComponent } from './features/menus/nav/nav.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './features/menus/footer/footer.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [NavComponent, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cinephoria-web';

  private readonly routerSubscription: Subscription;

  constructor(private readonly router: Router) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
