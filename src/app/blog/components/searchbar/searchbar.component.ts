import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, debounceTime, switchMap, Observable, of, filter } from 'rxjs';
import { BlogService } from '../../services/blog.service';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchbarComponent implements OnInit, OnDestroy {

  searchControl = new FormControl();
  destroy$ = new Subject();
  posts$: Observable<any> = of([]);
  @Output() postID = new EventEmitter();
  setPostID: string = '';
  showSpinner$: Observable<boolean> = this.blogService.showSpinner.asObservable();

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.searchPosts();
    this.blogService.clearInput.pipe(takeUntil(this.destroy$)).subscribe(val => this.searchControl!.setValue(val))
  }

  fetchPostByID(id: string) {
    id = this.setPostID;
    if(id.trim().length > 0) {
      this.postID.emit(id);
    }
    else {
      return
    }
  }

  searchPosts() {
    this.posts$ = this.searchControl.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      debounceTime(400),
      filter(((val: string) => val.trim().length > 0)),
      switchMap((val => this.blogService.searchPostsByTitle(val.toString())))
    );
  }

  onSelected(blog: any): void {
    this.searchControl!.setValue(blog.blogTitle);
    this.setPostID = blog._id;
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}
