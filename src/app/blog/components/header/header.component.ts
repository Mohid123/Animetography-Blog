import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @ViewChild('navbar') navbar?: ElementRef<any>;

  open = false;

  constructor() { }

  ngOnInit(): void {
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

}
