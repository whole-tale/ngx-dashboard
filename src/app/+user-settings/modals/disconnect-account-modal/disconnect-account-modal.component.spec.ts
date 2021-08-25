import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisconnectAccountModalComponent } from './disconnect-account-modal.component';

describe('DisconnectAccountModalComponent', () => {
  let component: DisconnectAccountModalComponent;
  let fixture: ComponentFixture<DisconnectAccountModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisconnectAccountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisconnectAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
