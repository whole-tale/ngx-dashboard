import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegisterDataDialogComponent } from './register-data-dialog.component';

describe('RegisterDataDialogComponent', () => {
  let component: RegisterDataDialogComponent;
  let fixture: ComponentFixture<RegisterDataDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterDataDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
