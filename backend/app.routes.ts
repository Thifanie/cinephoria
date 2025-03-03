import { Routes } from '@angular/router';
import { CompteComponent } from '../frontend/src/app/pages/compte/compte.component';
import { ContactComponent } from '../frontend/src/app/pages/contact/contact.component';
import { FilmsComponent } from '../frontend/src/app/pages/films/films.component';
import { ReservationComponent } from '../frontend/src/app/pages/reservation/reservation.component';
import { AccueilComponent } from '../frontend/src/app/pages/accueil/accueil.component';
import { InscriptionComponent } from '../frontend/src/app/pages/inscription/inscription.component';
import { ConnexionComponent } from '../frontend/src/app/pages/connexion/connexion.component';
import { AdministrationComponent } from '../frontend/src/app/pages/administration/administration.component';
import { ListSessionsComponent } from '../frontend/src/app/features/films/components/list-sessions/list-sessions.component';
import { AuthGuard } from '../frontend/src/app/guards/auth.guard';
import { AdminGuard } from '../frontend/src/app/guards/admin.guard';
import { FilmBookingComponent } from '../frontend/src/app/features/films/components/film-booking/film-booking.component';

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
