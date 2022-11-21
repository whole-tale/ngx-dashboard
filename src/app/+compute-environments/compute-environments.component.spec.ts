import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputeEnvironmentsComponent } from './compute-environments.component';

describe('ComputeEnvironmentsComponent', () => {
  let component: ComputeEnvironmentsComponent;
  let fixture: ComponentFixture<ComputeEnvironmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComputeEnvironmentsComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputeEnvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
