import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  open = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggle(open: boolean) {
    this.open = open;
  }

}
