import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiNotification } from '@taiga-ui/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { AuthService } from '../../auth.service';

enum stateEnum {
  Normal = "normal",
  Pass = "pass",
  Error = "error"
}

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPassComponent implements OnInit, OnDestroy {

  state: stateEnum.Normal | stateEnum.Pass | stateEnum.Error = stateEnum.Normal;
  stateStep2: stateEnum.Normal | stateEnum.Pass | stateEnum.Error = stateEnum.Normal;
  activeIndex: number = 0;
  resetPassForm!: FormGroup;
  private destroy$ = new Subject();
  isResettingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isResettingPass$: Observable<boolean> = this.isResettingSubject.asObservable();


  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private notif: NotificationsService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.initResetPassForm()
  }

  get f() {
    return this.resetPassForm.controls;
  }

  initResetPassForm() {
    this.resetPassForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    })
  }

  nextClick() {
    if(this.activeIndex === 0) {
      this.activeIndex = 1;
      this.state = stateEnum.Pass;
    }
  }

  sendPasswordReset() {
    this.isResettingSubject.next(true);
    const payload = {
      password: this.f['password']?.value,
      deletedCheck: false
    }
    this.authService.resetPassword(this.f['email']?.value, payload).pipe(takeUntil(this.destroy$)).subscribe((val: ApiResponse<any>) => {
      if(!val.hasErrors()) {
        this.isResettingSubject.next(false)
        this.notif.displayNotification(val.data.message, 'Password reset successfully', TuiNotification.Success)
        setTimeout(() => {
          this.router.navigate(['/api/auth/login']);
        }, 1500)
      }
      else {
        this.isResettingSubject.next(false)
        this.notif.displayNotification(val.errors[0]?.error?.message, 'Password reset failed', TuiNotification.Error)
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}
