import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RunningTalesComponent } from './running-tales.component';

describe('RunningTalesComponent', () => {
  let component: RunningTalesComponent;
  let fixture: ComponentFixture<RunningTalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningTalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningTalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
