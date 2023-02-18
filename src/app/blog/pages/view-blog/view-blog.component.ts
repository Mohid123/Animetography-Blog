import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewBlogComponent implements OnInit {

  Arr = Array;
  num: number = 6;

  constructor() { }

  ngOnInit(): void {
  }
}
