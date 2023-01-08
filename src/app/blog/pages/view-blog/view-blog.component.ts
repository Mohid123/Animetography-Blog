import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewBlogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
