import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, HostListener, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { AuthService } from 'src/app/auth/auth.service';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import { User } from 'src/@core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @ViewChild('navbar') navbar?: ElementRef<any>;

  open = false;
  openDropDown = false;
  loginState = false;
  writerAccess = false;
  currentUser: User | any;

  constructor(private auth: AuthService, @Inject(TuiDialogService) private readonly dialogService: TuiDialogService) {
    this.currentUser = this.auth.currentUserValue;
  }

  ngOnInit(): void {
    this.checkWriterStatus();
    this.checkLoginState();
  }

  ngAfterViewInit(): void {
    this.onScroll()
  }

  @HostListener('window: scroll', ['$event'])
  onScroll() {
    if(window.scrollY > this.navbar?.nativeElement.clientHeight) {
      this.navbar?.nativeElement.classList.add('add_bg');
    }
    else {
      this.navbar?.nativeElement.classList.remove('add_bg');
    }
  }

  toggle(open: boolean) {
    this.open = open;
  }

  checkLoginState() {
    if(this.auth.currentUserValue) {
      return this.loginState = true;
    }
    return this.loginState = false;
  }

  checkWriterStatus() {
    if(this.auth.currentUserValue?.isVerified === true && this.auth.currentUserValue?.isWriter === true) {
      return this.writerAccess = true
    }
    return this.writerAccess = false;
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, {
      closeable: true,
      dismissible: false
    }).subscribe();
  }

  logoutUser() {
    this.auth.logout()
  }

  toggleDropdown(): void {
    this.openDropDown = !this.openDropDown;
  }

}
