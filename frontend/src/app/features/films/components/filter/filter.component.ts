import { Component, OnDestroy, OnInit, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';
import { Type } from '../../models/type';

@Component({
  selector: 'app-filter',
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  types: Type[] = [];
  selectedTypeEvent = output<string>();

  constructor(private readonly dataService: DataService) {}

  ngOnInit(): void {
    this.subs.push(
      this.dataService.getType().subscribe((types) => {
        this.types = types;
        console.log(this.types);
      })
    );
  }

  selectType(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedTypeEvent.emit(selectedValue);
    console.log('Type sélectionné par Filter : ', selectedValue);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
