import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {FormControl} from '@angular/forms';
import { BlogService } from '../blog/services/blog.service';
import { Subject, BehaviorSubject, takeUntil } from 'rxjs';
import { BlogPost } from '../blog/models/blog.interface';
import { ApiResponse } from 'src/@core/models/api-response.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnDestroy {
  favorites$!: any;
  page: number;
  limit: number = 7;
  offset: number = 0;
  favoritePosts$ = new BehaviorSubject(true);
  destroy$: Subject<boolean> = new Subject();
  openDropDown = false;

  constructor(private auth: AuthService, private blog: BlogService) {
    this.page = 1;
    this.blog.getUserFavorites(this.page, this.limit, this.offset).pipe(takeUntil(this.destroy$)).subscribe((res: ApiResponse<any>) => {
      this.favorites$ = res;
      this.favoritePosts$.next(false);
    })
  }

  currentUser: any = this.auth.currentUserValue;
  Arr = Array;
  writerControl = new FormControl({value: this.auth.currentUserValue!.isWriter, disabled: true});
  activeIndex: number = 0;
  readonly items = [
    {
      text: 'Your favorites',
      icon: 'tuiIconHeartLarge',
    },
    {
      text: 'Your posts',
      icon: 'tuiIconAlignJustifyLarge',
    }
  ];

  trackByFn(index: number, item: BlogPost): string {
    return item._id;
  }

  toggleDropdown(): void {
    this.openDropDown = !this.openDropDown;
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
