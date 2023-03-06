import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { TuiNotification } from '@taiga-ui/core';
import { map, Observable, tap, BehaviorSubject, Subject, shareReplay } from 'rxjs';
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
  isSorting: Subject<boolean> = new Subject();
  dateSorting: Subject<boolean> = new Subject();
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
    return this.get(`/api/blog/getAllBlogs`, param).pipe(shareReplay(), map((res: ApiResponse<Blog>) => {
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
    return this.get(`/api/blog/searchPostByTitle/${blogTitle}`).pipe(shareReplay(), tap((res: ApiResponse<Blog>) => {
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

  filterPostsByDates(dateFrom: any, dateTo: any, page: number, limit: any, offset: any): Observable<ApiResponse<Blog>> {
    this.dateSorting.next(true);
    page--;
    limit = limit,
    offset = page ? limit * page : 0
    return this.post(`/api/blog/filterPostByDates?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${limit}&offset=${offset}`)
    .pipe(shareReplay(), map((res: ApiResponse<Blog>) => {
      if(!res.hasErrors()) {
        this.dateSorting.next(false);
        return res.data
      }
      else {
        this.dateSorting.next(false);
        return this.notif.displayNotification(res.errors[0].error?.message, 'Could not filter posts', TuiNotification.Error)
      }
    }))
  }

  sortPosts(sortStr: string, page: number, limit: any, offset: any): Observable<ApiResponse<Blog>> {
    this.isSorting.next(true)
    page--;
    limit = limit,
    offset = page ? limit * page: 0
    return this.post(`/api/blog/sortPostsByOrder?sortStr=${sortStr}&limit=${limit}&offset=${offset}`)
    .pipe(shareReplay(), map((res: any) => {
      if(!res.hasErrors()) {
        this.isSorting.next(false)
        return res
      }
      else {
        this.isSorting.next(false)
        return this.notif.displayNotification(res.errors[0].error?.message, 'Failed to sort', TuiNotification.Error)
      }
    }))
  }

  createNewPost(payload: BlogPost): Observable<ApiResponse<BlogPost>> {
    return this.post(`/api/blog/addBlogPost`, payload)
  }

  addPostToFavorites(payload: any): Observable<ApiResponse<any>> {
    return this.post(`/api/favorites/addToFavorites`, payload);
  }

  getUserFavorites(page: number, limit: any, offset: any): Observable<ApiResponse<any>> {
    page--;
    const params: any = {
      limit: limit,
      offset: page ? limit * page : 0
    }
    return this.get(`/api/blog/getUserFavorites`, params).pipe(shareReplay(), map((res: ApiResponse<any>) => {
      if(!res.hasErrors()) {
        return res.data
      }
      else {
        return this.notif.displayNotification('Failed to fetch your favorites', 'Something went wrong', TuiNotification.Error)
      }
    }))
  }
}
