import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { BlurhashComponent } from '../blurhash/blurhash.component';

@Component({
  selector: 'app-favorite-post',
  standalone: true,
  imports: [CommonModule, TuiAvatarModule, BlurhashComponent],
  templateUrl: './favorite-post.component.html',
  styleUrls: ['./favorite-post.component.scss']
})
export class FavoritePostComponent {
  @Input() postTitle!: string;
  @Input() postSubtitle!: string;
  @Input() author!: string;
  @Input() createdAt!: string;
  @Input() coverImage!: string;
  @Input() blurhash!: string;
}
