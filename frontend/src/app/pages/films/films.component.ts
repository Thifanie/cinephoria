import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListFilmsComponent } from '../../features/films/components/list-films/list-films.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-films',
  imports: [ListFilmsComponent, CommonModule],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css',
})
export class FilmsComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subs.push(
      this.route.fragment.subscribe((fragment) => {
        console.log('Fragment : ', fragment);
        if (fragment) {
          setTimeout(() => {
            const element = document.getElementById(fragment);
            console.log('Element du fragment : ', element);

            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
