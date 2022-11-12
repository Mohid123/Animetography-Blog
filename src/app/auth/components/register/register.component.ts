import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { MediaUploadService } from 'src/@core/common-services/media-upload.service';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { ResponseAddMedia } from 'src/@core/models/media-upload.model';
import { AuthService } from '../../auth.service';

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

  constructor(
    private fb: FormBuilder,
    private mediaService: MediaUploadService,
    private authService: AuthService) { }

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
      this.mediaService.uploadMedia('images', file).pipe(map((response: ApiResponse<ResponseAddMedia>) => {
       if(!response.hasErrors()) {
        this.uploadedImage = {
          captureFileURL: response.data?.url,
          blurHash: ''
        }
        return this.uploadedImage
       }
       else {
        alert('Something went wrong')
        return
       }
      })).subscribe((response) => {
        this.f['avatar']?.setValue([response])
        this.uploadingImage$.next(false)
      })
    }
  }

  submitProfile() {
    this.authService.registration(this.registerForm?.value).subscribe((response: ApiResponse<any>) => {
      if(!response.hasErrors()) {
        alert('Account creation successful')
      }
      else {
        alert(response.errors[0]?.error?.message)
      }
    })
  }

}
