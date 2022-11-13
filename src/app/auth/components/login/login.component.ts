import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TuiNotification } from '@taiga-ui/core';
import { BehaviorSubject, first, Observable, Subject, takeUntil } from 'rxjs';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSigningIn: Observable<boolean>;
  private destroy$ = new Subject();

  constructor(private fb: FormBuilder, private authService: AuthService, private notif: NotificationsService) {
    this.isSigningIn = this.authService.isLoading$
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  get f() {
    return this.loginForm.controls;
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([
          Validators.required
        ])
      ],
      password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ])
      ]
    })
  }

  submitLogin() {
    this.authService.login(this.loginForm?.value)
    .pipe(takeUntil(this.destroy$), first())
    .subscribe((response: any) => {
      if(response) {
        this.notif.displayNotification('You have logged in successfully', 'Login Sucess!', TuiNotification.Success)
      }
    })
  }

}
