import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent {
  @Output() sortStr = new EventEmitter();

  constructor() { }


  sortFromAtoZ(sort: string) {
    this.sortStr.emit(sort);
  }

}
