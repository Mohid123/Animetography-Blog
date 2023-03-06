import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritePostComponent } from './favorite-post.component';

describe('FavoritePostComponent', () => {
  let component: FavoritePostComponent;
  let fixture: ComponentFixture<FavoritePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FavoritePostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
