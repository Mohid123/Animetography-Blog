import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TuiNotification } from '@taiga-ui/core';
import { Observable, pluck, Subject, switchMap, takeUntil } from 'rxjs';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { AuthService } from 'src/app/auth/auth.service';
import { BlogPost } from '../../models/blog.interface';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-read-blog',
  templateUrl: './read-blog.component.html',
  styleUrls: ['./read-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadBlogComponent implements OnDestroy {
  post$!: Observable<BlogPost | any>;
  showSpinner$ = this.blogService.showSpinner.asObservable();
  destroy$ = new Subject();
  constructor(
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private notif: NotificationsService
  ) {
    this.post$ = this.activatedRoute.params.pipe(
      pluck('id'),
      switchMap((val => this.blogService.getPostById(val)))
    );
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
      console.log(payload)
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

  ngOnDestroy(): void {
      this.destroy$.complete();
      this.destroy$.unsubscribe()
  }
}
