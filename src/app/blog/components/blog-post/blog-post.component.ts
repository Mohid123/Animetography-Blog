import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { BlogPost } from '../../models/blog.interface';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogPostComponent {
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
