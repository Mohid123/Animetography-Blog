import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TuiNotification } from '@taiga-ui/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { User } from 'src/@core/models/user.model';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailConfirmComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  confirmRequest = new BehaviorSubject(false);
  confirmRequest$ = this.confirmRequest.asObservable();
  confirmationText = new BehaviorSubject('');
  confirmationText$ = this.confirmationText.asObservable();

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthService, private notif: NotificationsService) {}

  ngOnInit(): void {
    this.checkUserStatus()
  }

  checkUserStatus() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(val => {
      if(val['id'] && val['token']) {
        this.auth.getUserById(val['id']).pipe(takeUntil(this.destroy$))
        .subscribe((res: ApiResponse<User>) => {
          if(!res.hasErrors()) {
            if(res.data.isVerified === true) {
              this.confirmationText.next('Your account has already been verified!')
            }
          }
        })
      }
    })
  }

  verifyQueryParamsAndSendEmailConfirmationRequest() {
    this.confirmRequest.next(true);
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(val => {
      if(val['id'] && val['token']) {
        this.auth.sendConfirmationRequest(val['id']).pipe(takeUntil(this.destroy$))
        .subscribe((res: ApiResponse<any>) => {
          if(!res.hasErrors()) {
            this.confirmRequest.next(false);
            setTimeout(() => {this.confirmationText.next(res.data.message)}, 500);
          }
          else {
            this.confirmRequest.next(false);
            this.notif.displayNotification(res.errors[0]?.error?.message, 'An error has occured', TuiNotification.Error);
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
