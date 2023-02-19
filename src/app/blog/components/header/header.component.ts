import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, HostListener, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { AuthService } from 'src/app/auth/auth.service';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @ViewChild('navbar') navbar?: ElementRef<any>;

  open = false;
  loginState = false;

  constructor(private auth: AuthService, @Inject(TuiDialogService) private readonly dialogService: TuiDialogService) { }

  ngOnInit(): void {
    this.checkLoginState()
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

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, {
      closeable: true,
      dismissible: false
    }).subscribe();
  }

  logoutUser() {
    this.auth.logout()
  }

}
