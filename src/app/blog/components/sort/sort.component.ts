import { Component, Output, EventEmitter } from '@angular/core';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent {
  @Output() sortStr = new EventEmitter();

  constructor(public blogService: BlogService) { }


  sortFromAtoZ(sort: string) {
    this.sortStr.emit(sort);
  }

}
