import { ChangeDetectionStrategy, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { TuiNotification } from '@taiga-ui/core';
import {TuiMarkerHandler} from '@taiga-ui/core';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { BlogService } from '../../services/blog.service';

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
  value: TuiDayRange | any = null;
  firstMonth = TuiMonth.currentLocal();
  hoveredItem: TuiDay | null = null;
  readonly markerHandler: TuiMarkerHandler = (day: TuiDay) => day.day % 2 === 0 ? TWO_DOTS : ONE_DOT;
  @Output() filterByDate = new EventEmitter<void>();

  constructor(private notif: NotificationsService, public blogService: BlogService) {}

  ngOnInit(): void {}

  filterPostByDateRange() {
    const params: any = {
      dateFrom: new Date(this.value?.from?.year, this.value?.from.month, this.value?.from?.day).getTime(),
      dateTo: new Date(this.value?.to?.year, this.value?.to.month, this.value?.to?.day).getTime(),
    }
    if(params.dateFrom && params.dateTo) {
      this.filterByDate.emit(params)
      this.toggleDropdown()
    }
    else {
      this.notif.displayNotification('Please select a start and end date', 'Filter By Date', TuiNotification.Info);
    }
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
  }

  onMonthChangeFirst(month: TuiMonth): void {
    this.firstMonth = month;
  }

}
