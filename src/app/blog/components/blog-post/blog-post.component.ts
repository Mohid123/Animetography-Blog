import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogPostComponent {
  @Input() postTitle!: string;
  @Input() postSubtitle!: string;
  @Input() author!: string;
  @Input() createdAt!: string;
  @Input() coverImage!: string;
  @Input() blurhash!: string;
}
