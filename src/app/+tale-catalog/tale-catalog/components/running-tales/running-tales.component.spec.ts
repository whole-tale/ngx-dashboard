import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningTalesComponent } from './running-tales.component';

describe('RunningTalesComponent', () => {
  let component: RunningTalesComponent;
  let fixture: ComponentFixture<RunningTalesComponent>;

  beforeEach(async(() => {
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
