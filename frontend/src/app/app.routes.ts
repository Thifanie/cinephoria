import { Routes } from '@angular/router';
import { CompteComponent } from './pages/compte/compte.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FilmsComponent } from './pages/films/films.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { AdministrationComponent } from './pages/administration/administration.component';
import { ListSessionsComponent } from './features/films/components/list-sessions/list-sessions.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { FilmBookingComponent } from './features/films/components/film-booking/film-booking.component';

export const prerender = false;

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'accueil' },
  { path: 'accueil', component: AccueilComponent },
  { path: 'compte', component: CompteComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'films', component: FilmsComponent },
  {
    path: 'sessions/:id',
    component: ListSessionsComponent,
    data: { ssr: false },
  },
  { path: 'reservation', component: ReservationComponent },
  {
    path: 'reservation/:id',
    component: FilmBookingComponent,
    canActivate: [AuthGuard],
  },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connexion', component: ConnexionComponent },
  {
    path: 'admin',
    component: AdministrationComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
];
