import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListFilmsComponent } from '../../features/films/components/list-films/list-films.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FilterComponent } from '../../features/films/components/filter/filter.component';

@Component({
  selector: 'app-films',
  imports: [ListFilmsComponent, CommonModule, FilterComponent],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css',
})
export class FilmsComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  selectedType: string = '';

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

  upScroll() {
    window.scrollTo(0, 0);
  }

  selectType(type: string): void {
    this.selectedType = type;
    console.log('selectedType de Films : ', this.selectedType);
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
