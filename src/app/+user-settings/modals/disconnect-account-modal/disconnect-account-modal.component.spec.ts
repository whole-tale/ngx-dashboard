import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisconnectAccountModalComponent } from './disconnect-account-modal.component';

describe('DisconnectAccountModalComponent', () => {
  let component: DisconnectAccountModalComponent;
  let fixture: ComponentFixture<DisconnectAccountModalComponent>;

  beforeEach(async(() => {
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
