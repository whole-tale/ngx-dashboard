import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleInputModalComponent } from './single-input-modal.component';

describe('SingleInputModalComponent', () => {
  let component: SingleInputModalComponent;
  let fixture: ComponentFixture<SingleInputModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SingleInputModalComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
