import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { MediaUploadService } from 'src/@core/common-services/media-upload.service';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { ResponseAddMedia } from 'src/@core/models/media-upload.model';
import { AuthService } from '../../auth.service';
import { TuiNotification } from '@taiga-ui/core';

interface profileImage {
  captureFileURL: string,
  blurHash: string
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  uploadingImage$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  uploadingImage: Observable<boolean> = this.uploadingImage$.asObservable();
  uploadedImage: profileImage = {
    captureFileURL: '',
    blurHash: ''
  }
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private mediaService: MediaUploadService,
    private authService: AuthService,
    private notif: NotificationsService
    ) { }

  ngOnInit(): void {
    this.initResgisterForm();
  }

  initResgisterForm() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.compose([
        Validators.required,
      ])
      ],

      lastName: ['', Validators.compose([
        Validators.required,
      ])
      ],

      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])
      ],

      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
      ])
      ],

      avatar:
      [{
        captureFileURL: '',
        blurHash: ''
      }],
      isWriter: false
    })
  }

  get f() {
    return this.registerForm.controls;
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
        this.notif.displayNotification(response.errors[0]?.error?.message, 'An error has occured', TuiNotification.Error)
        return
       }
      })).subscribe((response) => {
        this.f['avatar']?.setValue([response])
        this.uploadingImage$.next(false)
        this.notif.displayNotification('Image uploaded successfully', 'Success!', TuiNotification.Success)
      })
    }
  }

  submitProfile() {
    this.authService.registration(this.registerForm?.value).pipe(takeUntil(this.destroy$)).subscribe((response: ApiResponse<any>) => {
      if(!response.hasErrors()) {
        this.notif.displayNotification('Your account creation was successful', 'Congratulations!', TuiNotification.Success)
      }
      else {
        this.notif.displayNotification(response.errors[0]?.error?.message, 'An error has occured', TuiNotification.Error)
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}
