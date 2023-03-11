import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BlogPost } from '../../models/blog.interface';

@Component({
  selector: 'app-top-post',
  templateUrl: './top-post.component.html',
  styleUrls: ['./top-post.component.scss']
})
export class TopPostComponent {
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
