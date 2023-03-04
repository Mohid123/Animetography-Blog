import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPostSkeletonComponent } from './top-post-skeleton.component';

describe('TopPostSkeletonComponent', () => {
  let component: TopPostSkeletonComponent;
  let fixture: ComponentFixture<TopPostSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TopPostSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopPostSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
