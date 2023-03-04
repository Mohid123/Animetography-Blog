import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { TuiNotification } from '@taiga-ui/core';
import { map, Observable, tap, BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/@core/common-services/api.service';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { BlogPost, PostData } from '../models/blog.interface';

type Blog = PostData | BlogPost | any

@Injectable({
  providedIn: 'root'
})
export class BlogService extends ApiService<Blog> {
  showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(false);
  showPostSpinner: BehaviorSubject<boolean> = new BehaviorSubject(false);
  clearInput = new EventEmitter()

  constructor(protected override http: HttpClient, private notif: NotificationsService) {
    super(http)
  }

  getAllPosts(page: number, limit: any, offset: any): Observable<ApiResponse<Blog>> {
    this.showPostSpinner.next(true);
    page--;
    const param: any = {
      limit: limit,
      offset: page ? limit * page : 0,
    }
    return this.get(`/api/blog/getAllBlogs`, param).pipe(map((res: ApiResponse<Blog>) => {
      if(!res.hasErrors()) {
        this.showPostSpinner.next(false);
        return res.data;
      }
      else {
        this.showPostSpinner.next(false);
        return this.notif.displayNotification(res.errors[0].error?.message, 'Failed to fetch posts', TuiNotification.Error)
      }
    }))
  }

  searchPostsByTitle(blogTitle: string): Observable<ApiResponse<Blog>> {
    return this.get(`/api/blog/searchPostByTitle/${blogTitle}`).pipe(tap((res: ApiResponse<Blog>) => {
      if(res.hasErrors()) {
        this.notif.displayNotification(res.errors[0].error?.message, 'Search failed', TuiNotification.Error)
      }
    }))
  }

  getPostById(postID: string): Observable<ApiResponse<Blog>> {
    this.showSpinner.next(true);
    return this.get(`/api/blog/getBlogByID/${postID}`).pipe(map((res: ApiResponse<Blog>) => {
      if(!res.hasErrors()) {
        this.showSpinner.next(false);
        return res.data;
      }
      else {
        this.showSpinner.next(false);
        return this.notif.displayNotification(res.errors[0].error?.message, 'Failed to fetch post', TuiNotification.Error)
      }
    }))
  }
}