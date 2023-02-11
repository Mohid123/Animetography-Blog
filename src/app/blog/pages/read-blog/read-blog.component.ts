import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-read-blog',
  templateUrl: './read-blog.component.html',
  styleUrls: ['./read-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadBlogComponent {
  constructor() {}
}
