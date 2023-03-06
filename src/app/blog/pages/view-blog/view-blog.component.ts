import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { BlogPost, PostData } from '../../models/blog.interface';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewBlogComponent {
  offset: number = 0;
  limit: number = 7;
  page: number;
  posts$!: Observable<PostData | any>;
  showSpinner$: Observable<boolean> = this.blogService.showPostSpinner.asObservable();
  Arr = Array;
  isSearched = new BehaviorSubject(false);
  isSearched$ = this.isSearched.asObservable();
  dateFilterApplied = new BehaviorSubject(false);
  sortVal = '';

  constructor(private blogService: BlogService) {
    this.page = 1;
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

  fetchPostsByDateRange(value: any) {
    this.posts$ = this.blogService.filterPostsByDates(value.dateFrom, value.dateTo, this.page, this.limit, this.offset);
    this.dateFilterApplied.next(true);
  }

  sortPostsInOrder(value: any) {
    if(this.sortVal == '' || this.sortVal == 'Ascending') {
      this.sortVal = 'Descending'
    }
    else {
      this.sortVal = value
    }
    this.posts$ = this.blogService.sortPosts(this.sortVal, this.page, this.limit, this.offset)
  }

  clearSearch() {
    this.fetchAllPosts();
    this.isSearched.next(false);
    this.dateFilterApplied.next(false);
    this.blogService.clearInput.emit('');
  }

  trackByFn(index: number, item: BlogPost): string {
    return item._id;
  }
}
