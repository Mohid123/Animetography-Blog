import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BlogPost } from 'src/app/blog/models/blog.interface';

@Component({
  selector: 'app-draft-post',
  templateUrl: './draft-post.component.html',
  styleUrls: ['./draft-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraftPostComponent {
  @Input() post!: BlogPost | any;
  @Input() showOptions!: boolean;
  @Output() editPost = new EventEmitter();
  @Output() deletePost = new EventEmitter();

  editPostRequest() {
    this.editPost.emit(this.post)
  }

  deletePostRequest() {
    this.deletePost.emit(this.post)
  }
}
