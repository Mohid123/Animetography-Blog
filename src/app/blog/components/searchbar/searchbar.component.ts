import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TUI_DEFAULT_MATCHER } from '@taiga-ui/cdk';
import { Subject, takeUntil, debounceTime, map, Observable, of } from 'rxjs';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchbarComponent implements OnInit, OnDestroy {

  searchControl = new FormControl();
  destroy$ = new Subject();
  users$: Observable<any> = of([])
  constructor() { }

  ngOnInit(): void {
    // this.searchPosts()
  }

  searchItems() {
    console.log("clicked")
  }

  // searchPosts() {
  //   this.users$ = this.searchControl.valueChanges
  //   .pipe(
  //     takeUntil(this.destroy$),
  //     debounceTime(400),
  //     map(val => USERS.filter(user => TUI_DEFAULT_MATCHER(user, val)))
  //   )
  // }

  // onSelected(user: User): void {
  //   this.searchControl!.setValue(user.toString());
  // }

  ngOnDestroy(): void {
    // this.destroy$.complete();
    // this.destroy$.unsubscribe();
  }

}
