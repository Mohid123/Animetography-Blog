import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getItem, setItem, StorageItem } from '../../@core/utils/local-storage.utils';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, exhaustMap, finalize, map, tap } from 'rxjs/operators';
import { RegisterModel } from '../auth/models/register.model';
import { AuthCredentials } from '../../@core/models/auth-credentials.model';
import { ApiResponse } from '../../@core/models/api-response.model'
import { SignInResponse } from '../../@core/models/sign-in-response.model';
import { User } from '../../@core/models/user.model';
import { ApiService } from '../../@core/common-services/api.service';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { TuiNotification } from '@taiga-ui/core';

type AuthApiData = SignInResponse | any;

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService<AuthApiData> {

  // public fields
  currentUser$: Observable<User | null>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<User | null>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: User | null) {
    this.currentUserSubject.next(user);
  }

  get JwtToken(): string {
    return getItem(StorageItem.JwtToken)?.toString() || '';
  }

  constructor(
    protected override http: HttpClient,
    private router: Router,
    private notif: NotificationsService
  ) {
    super(http);
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<User | null>(<User>getItem(StorageItem.User));
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();

  }

  // public methods
  login(params: AuthCredentials) {
    this.isLoadingSubject.next(true);
    return this.post('/api/auth/login', params).pipe(
      map((result: ApiResponse<any>) => {
        console.log('result',result);
        if (!result.hasErrors()) {
          setItem(StorageItem.User, result?.data?.user || null);
          setItem(StorageItem.JwtToken, result?.data?.token || null);
          if(result?.data?.user)
          this.currentUserSubject.next(result?.data?.user);
          return result
        }
        else {
          this.notif.displayNotification(result.errors[0]?.error?.message, 'Login Failed!', TuiNotification.Error);
          throw result.errors[0].error?.message
        }
      }),
      exhaustMap((res)=>{
        if (res?.data?.user) {
          return this.get(`/api/user/getUserByID/${res?.data?.user?.id}`)
        } else {
          return of(null);
        }
      }),
      tap((res)=> {
        if(res && !res?.hasErrors()) {
          this.updateUser(res.data)
        }
      }),
      catchError((err) => {
        throw err
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    setItem(StorageItem.User, null);
    setItem(StorageItem.JwtToken, null);
    this.router.navigate(['/api/auth/login'], {
      queryParams: {},
    });
  }

  registration(user: RegisterModel) {
    this.isLoadingSubject.next(true);
    return this.post('/api/auth/signup', user).pipe(
      map((user:ApiResponse<SignInResponse>) => {
        this.isLoadingSubject.next(false);
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  resetPassword(email: string, resetPassValue: {password: string, deletedCheck: boolean}): Observable<ApiResponse<any>> {
    return this.post(`/api/user/resetPassword/${email}`, resetPassValue);
  }

  updateUser(user:User) {
    if (user) {
      this.currentUserSubject.next(user);
      setItem(StorageItem.User, user);
    }
  }

}
