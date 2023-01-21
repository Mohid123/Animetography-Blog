import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import {TuiMarkerHandler} from '@taiga-ui/core';

const TWO_DOTS: [string, string] = [`var(--tui-primary)`, `var(--tui-info-fill)`];
const ONE_DOT: [string] = [`var(--tui-success-fill)`];

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DateFilterComponent implements OnInit {

  open = false;
  value: TuiDayRange | null = null;
  firstMonth = TuiMonth.currentLocal();
  hoveredItem: TuiDay | null = null;
  readonly markerHandler: TuiMarkerHandler = (day: TuiDay) => day.day % 2 === 0 ? TWO_DOTS : ONE_DOT;


  constructor() { }

  ngOnInit(): void {
  }

  toggleDropdown(): void {
    this.open = !this.open;
  }

  onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }

  onDayClick(day: TuiDay): void {
    if (this.value === null || !this.value.isSingleDay) {
      this.value = new TuiDayRange(day, day);
    }

    this.value = TuiDayRange.sort(this.value.from, day);
    console.log(this.value)
  }

  onMonthChangeFirst(month: TuiMonth): void {
    this.firstMonth = month;
  }

}
