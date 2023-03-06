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
  showSpinner$ = this.blogService.showSpinner.asObservable();

  constructor(private blogService: BlogService, private activatedRoute: ActivatedRoute) {
    this.post$ = this.activatedRoute.params.pipe(
      pluck('id'),
      switchMap((val => this.blogService.getPostById(val)))
    )
  }
}
