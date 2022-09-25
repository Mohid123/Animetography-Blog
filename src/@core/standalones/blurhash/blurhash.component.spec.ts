import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlurhashComponent } from './blurhash.component';

describe('BlurhashComponent', () => {
  let component: BlurhashComponent;
  let fixture: ComponentFixture<BlurhashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BlurhashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlurhashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
