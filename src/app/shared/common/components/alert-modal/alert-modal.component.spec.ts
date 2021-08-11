import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertModalComponent } from './alert-modal.component';

describe('AlertModalComponent', () => {
  let component: AlertModalComponent;
  let fixture: ComponentFixture<AlertModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AlertModalComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
