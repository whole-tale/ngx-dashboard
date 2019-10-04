import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDataDialogComponent } from './register-data-dialog.component';

describe('RegisterDataDialogComponent', () => {
  let component: RegisterDataDialogComponent;
  let fixture: ComponentFixture<RegisterDataDialogComponent>;

  beforeEach(async(() => {
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
