import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftPostComponent } from './draft-post.component';

describe('DraftPostComponent', () => {
  let component: DraftPostComponent;
  let fixture: ComponentFixture<DraftPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraftPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
