import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TUI_DEFAULT_MATCHER } from '@taiga-ui/cdk';
import { Subject, takeUntil, debounceTime, map, Observable, of } from 'rxjs';

class User {
  constructor(
      readonly firstName: string,
      readonly lastName: string,
      readonly avatarUrl: string | null = null,
      readonly card: string = ``,
  ) {}

  toString(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

const USERS = [
  new User(
      `Roman`,
      `Sedov`,
      `https://avatars.githubusercontent.com/u/10106368`,
  ),
  new User(
      `Alex`,
      `Inkin`,
      `https://taiga-ui.dev/assets/images/avatar.jpg`,
      `1234123412341234`,
  ),
  new User(`Dmitriy`, `Demenskiy`),
  new User(`Evgeniy`, `Mamaev`),
  new User(`Ivan`, `Ishmametiev`),
  new User(`Igor`, `Katsuba`),
  new User(`Yulia`, `Tsareva`),
];

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchbarComponent implements OnInit, OnDestroy {

  searchControl = new FormControl();
  destroy$ = new Subject();
  users$: Observable<any> = of(null)
  constructor() { }

  ngOnInit(): void {
    this.searchPosts()
  }

  searchPosts() {
    this.users$ = this.searchControl.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      debounceTime(400),
      map(val => USERS.filter(user => TUI_DEFAULT_MATCHER(user, val)))
    )
  }

  onSelected(user: User): void {
    this.searchControl!.setValue(user.toString());
}

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}
