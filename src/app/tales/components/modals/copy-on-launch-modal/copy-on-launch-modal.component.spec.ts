import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CopyOnLaunchModalComponent } from './copy-on-launch-modal.component';

describe('CopyOnLaunchModalComponent', () => {
  let component: CopyOnLaunchModalComponent;
  let fixture: ComponentFixture<CopyOnLaunchModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CopyOnLaunchModalComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyOnLaunchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
