import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublicTalesComponent } from './public-tales.component';

describe('PublicTalesComponent', () => {
  let component: PublicTalesComponent;
  let fixture: ComponentFixture<PublicTalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicTalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicTalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
