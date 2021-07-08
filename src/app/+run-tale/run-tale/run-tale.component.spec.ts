import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RunTaleComponent } from './run-tale.component';

describe('RunTaleComponent', () => {
  let component: RunTaleComponent;
  let fixture: ComponentFixture<RunTaleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RunTaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunTaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
