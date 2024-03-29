import { Component, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiDialogContext, TuiNotification } from '@taiga-ui/core';
import { map, Observable, pluck, Subject, switchMap, takeUntil } from 'rxjs';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { AuthService } from 'src/app/auth/auth.service';
import { BlogPost } from '../../models/blog.interface';
import { BlogService } from '../../services/blog.service';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { Meta, Title } from '@angular/platform-browser';
import Editor from 'ckeditor5/build/ckeditor';

@Component({
  selector: 'app-read-blog',
  templateUrl: './read-blog.component.html',
  styleUrls: ['./read-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadBlogComponent implements OnDestroy {
  public Editor: any = Editor;
  post$!: Observable<BlogPost | any>;
  postSummary!: string;
  showSpinner$ = this.blogService.showSpinner.asObservable();
  destroy$ = new Subject();
  constructor(
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private notif: NotificationsService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      {name: 'description', content: 'Storytelling in Animation'},
      {name: 'author', content: 'Animetography-Blog'},
      {name: 'keywords', content: 'Animation, Blog, Visual storytelling'}
    ]);
    this.setTitle('Read Blog Post');

    this.post$ = this.activatedRoute.params.pipe(
      pluck('slugName'),
      switchMap((val => this.blogService.getPostBySlugName(val)))
    );

    this.post$.pipe(map((val: any) => val.blogSubtitle)).subscribe(val => this.postSummary = val.slice(0, 100))
  }

  public setTitle( newTitle: string) {
    this.title.setTitle( newTitle );
  }

  addToFavorites() {
    if(this.auth.currentUserValue) {
      let postID;
      this.activatedRoute.params.pipe(pluck('id')).subscribe(val => {
        postID = val;
      })
      const payload: any = {
        postID: postID,
        userID: this.auth.currentUserValue?.id,
        deletedCheck: false
      }
      this.blogService.addPostToFavorites(payload).pipe(takeUntil(this.destroy$))
      .subscribe((res: ApiResponse<any>) => {
        if(!res.hasErrors()) {
          this.notif.displayNotification('Added to favorites', 'Favorite Posts', TuiNotification.Success);
        }
        else {
          this.notif.displayNotification(res.errors[0]?.error?.message, 'Something went wrong', TuiNotification.Error)
        }
      })
    }
    else {
      this.notif.displayNotification('You must be logged in to add post to favorites', 'Favorite Posts', TuiNotification.Warning)
    }
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, {
      closeable: true,
      dismissible: true
    }).subscribe();
  }

  shareOnTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${this.postSummary}...%0aRead more here:%0a&url=${window.location.href}`, '_blank')
  }

  shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe()
  }
}
