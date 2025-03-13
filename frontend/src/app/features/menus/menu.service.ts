import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  // ActiveMenu garde en mémoire le menu actuellement ouvert
  private readonly activeMenuSubject = new BehaviorSubject<string | null>(null);
  activeMenu$ = this.activeMenuSubject.asObservable(); // Observable à écouter dans les composants

  // Met à jour le menu actif
  setActiveMenu(menuId: string | null): void {
    this.activeMenuSubject.next(menuId);
  }
}
