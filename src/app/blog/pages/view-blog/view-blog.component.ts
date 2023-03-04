import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { BlogPost, PostData } from '../../models/blog.interface';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewBlogComponent implements OnInit {
  offset: number = 0;
  limit: number = 7;
  page: number;
  posts$!: Observable<PostData | any>;
  showSpinner$: Observable<boolean> = this.blogService.showPostSpinner.asObservable();
  Arr = Array;
  isSearched = new BehaviorSubject(false);
  isSearched$ = this.isSearched.asObservable();

  constructor(private blogService: BlogService) {
    this.page = 1;
  }

  ngOnInit(): void {
    this.fetchAllPosts();
  }

  fetchAllPosts() {
    this.posts$ = this.blogService.getAllPosts(this.page, this.limit, this.offset);
  }

  next(): void {
    this.page++;
    this.posts$ = this.blogService.getAllPosts(this.page, this.limit, this.offset);
  }

  fetchPostById(id: string) {
    this.posts$ = this.blogService.getPostById(id).pipe(map((res: any) => {
      return {data: [res], totalCount: res.length}
    }));
    this.isSearched.next(true);
  }

  clearSearch() {
    this.fetchAllPosts();
    this.isSearched.next(false);
    this.blogService.clearInput.emit('');
  }

  trackByFn(index: number, item: BlogPost): string {
    return item._id;
  }
}
