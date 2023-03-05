import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, pluck, switchMap } from 'rxjs';
import { BlogPost } from '../../models/blog.interface';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-read-blog',
  templateUrl: './read-blog.component.html',
  styleUrls: ['./read-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadBlogComponent {
  post$!: Observable<BlogPost | any>;

  constructor(private blogService: BlogService, private activatedRoute: ActivatedRoute) {
    console.log(this.activatedRoute)
    this.post$ = this.activatedRoute.params.pipe(
      pluck('id'),
      switchMap((val => this.blogService.getPostById(val)))
    )
  }
}
