import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationStreamComponent } from './notification-stream.component';

describe('NotificationStreamComponent', () => {
  let component: NotificationStreamComponent;
  let fixture: ComponentFixture<NotificationStreamComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NotificationStreamComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
