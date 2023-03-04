import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-post',
  templateUrl: './top-post.component.html',
  styleUrls: ['./top-post.component.scss']
})
export class TopPostComponent {
  @Input() postTitle!: string;
  @Input() postSubtitle!: string;
  @Input() author!: string;
  @Input() createdAt!: string;
  @Input() coverImage!: string;
  @Input() blurhash!: string;

}
