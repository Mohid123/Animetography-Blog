import { ChangeDetectionStrategy, Component, Inject, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, map, BehaviorSubject, Subject, takeUntil, of } from 'rxjs';
import { BlogPost, PostData } from '../../models/blog.interface';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/@core/models/user.model';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiDialogService } from '@taiga-ui/core';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import { Title } from '@angular/platform-browser';
import { db } from 'src/@core/indexdb/db';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewBlogComponent implements OnDestroy {
  deletePostID!: string
  offset: number = 0;
  limit: number = 10;
  page: number;
  posts$!: Observable<PostData | any>;
  showSpinner$: Observable<boolean> = this.blogService.showPostSpinner.asObservable();
  Arr = Array;
  isSearched = new BehaviorSubject(false);
  isSearched$ = this.isSearched.asObservable();
  dateFilterApplied = new BehaviorSubject(false);
  sortVal = '';
  user: User | null;
  @ViewChild('template') template: any;
  destroy$ = new Subject();
  index: number;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private auth: AuthService,
    private cf: ChangeDetectorRef,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private title: Title
    ) {
    this.setTitle('Animetography Blog');
    this.page = 1;
    this.index = 0
    this.fetchAllPosts();
    this.user = this.auth.currentUserValue;
  }

  public setTitle( newTitle: string) {
    this.title.setTitle( newTitle );
  }

  async fetchAllPosts() {
    let cachedPosts = await db.fetchAllPosts();
    if(cachedPosts.length > 0) {
      this.cf.detectChanges();
      this.posts$ = of(cachedPosts[0]);
      this.cf.detectChanges();
    }
    else {
      this.posts$ = this.blogService.getAllPosts(this.page, this.limit, this.offset);
    }
  }

  goToPage(index: number) {
    this.index = index;
    this.page = index + 1;
    if(index > 1) {
      this.posts$ = this.blogService.getAllPosts(this.page, 4, this.offset);
    }
    else {
      this.posts$ = this.blogService.getAllPosts(this.page, this.limit, this.offset);
    }
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

  editPost(post: BlogPost) {
    if(post) {
      this.blogService.sendBlogPostForEdit = post;
      this.router.navigate(['/edit-post', post._id]);
    }
  }

  async deletePost() {
    this.blogService.deletePost(this.deletePostID).pipe(takeUntil(this.destroy$))
    .subscribe(async (res: any) => {
      if(res) {
        let cachedPosts = await db.fetchAllPosts();
        if(cachedPosts.length > 0) {
          cachedPosts[0].data = cachedPosts[0].data?.filter((val: any) => val._id !== this.deletePostID)
          db.updatePosts(cachedPosts[0])
        }
        this.fetchAllPosts()
      }
    });
  }

  openDeleteDialog(post: BlogPost | any) {
    if(post) {
      this.deletePostID = post._id || post.id
      this.showDialog(this.template)
    }
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, {
      closeable: true,
      dismissible: false
    }).subscribe();
  }

  floorNumber(value: number) {
    return Math.ceil(value)
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
