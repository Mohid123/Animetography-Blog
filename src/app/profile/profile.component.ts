import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { BlogService } from '../blog/services/blog.service';
import { Subject, BehaviorSubject, takeUntil, map } from 'rxjs';
import { BlogPost } from '../blog/models/blog.interface';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { MediaUploadService } from 'src/@core/common-services/media-upload.service';
import { profileImage } from '../auth/components/register/register.component';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { TuiNotification } from '@taiga-ui/core';
import { ResponseAddMedia } from 'src/@core/models/media-upload.model';
import { User } from 'src/@core/models/user.model';

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
  isEditing$ = new Subject();
  profileUpdating$ = new Subject<boolean>();
  uploadingImage$ = new Subject<boolean>();
  profileForm!: FormGroup;
  uploadedImage: profileImage = {
    captureFileURL: '',
    blurHash: ''
  }

  constructor(
    private auth: AuthService,
    private blog: BlogService,
    private mediaService: MediaUploadService,
    private notif: NotificationsService,
    private fb: FormBuilder
    ) {
    this.page = 1;
    this.blog.getUserFavorites(this.page, this.limit, this.offset).pipe(takeUntil(this.destroy$)).subscribe((res: ApiResponse<any>) => {
      this.favorites$ = res;
      this.favoritePosts$.next(false);
    });
    this.initProfileForm();
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

  get f() {
    return this.profileForm.controls;
  }

  trackByFn(index: number, item: BlogPost): string {
    return item._id;
  }

  toggleDropdown(): void {
    this.openDropDown = !this.openDropDown;
  }

  initProfileForm() {
    this.profileForm = this.fb.group({
      firstName: [this.currentUser?.firstName || ''],
      lastName: [this.currentUser?.lastName || ''],
      username: [this.currentUser?.username || ''],
      avatar: [this.currentUser?.avatar] || 
        [{
          captureFileURL: '',
          blurHash: ''
        }]
    })
  }

  cancelUpdate() {
    this.isEditing$.next(false);
    this.auth.getUserById(this.currentUser?.id);
  }

  onSelectFile(event: any) {
    let file = event.target.files[0];
    if(file !== undefined && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      this.uploadingImage$.next(true)
      this.mediaService.uploadMedia('images', file).pipe(takeUntil(this.destroy$), map((response: ApiResponse<ResponseAddMedia>) => {
       if(!response.hasErrors()) {
        this.uploadedImage = {
          captureFileURL: response.data?.url,
          blurHash: ''
        }
        return this.uploadedImage
       }
       else {
        return this.notif.displayNotification(response.errors[0]?.error?.message, 'An error has occured', TuiNotification.Error);
       }
      })).subscribe((response) => {
        this.f['avatar']?.setValue([response])
        this.uploadingImage$.next(false)
        this.notif.displayNotification('Image uploaded successfully', 'Success!', TuiNotification.Success)
      })
    }
  }

  submitProfileChanges() {
    this.profileUpdating$.next(true)
    this.auth.updateUserByID(this.currentUser?.id, this.profileForm.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res: any) => {
      if(!res.hasErrors()) {
        this.profileUpdating$.next(false)
        this.auth.getUserById(this.auth.currentUserValue!.id).pipe(takeUntil(this.destroy$))
        .subscribe((val: User | any) => {
          this.auth.updateUser(val?.data);
          this.notif.displayNotification('Profile updated successfully', 'Profile Update', TuiNotification.Success);
          this.isEditing$.next(false);
          this.currentUser = this.auth.currentUserValue;
        });
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
