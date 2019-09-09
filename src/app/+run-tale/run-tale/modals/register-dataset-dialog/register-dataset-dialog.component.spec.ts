import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDatasetDialogComponent } from './register-dataset-dialog.component';

describe('RegisterDatasetDialogComponent', () => {
  let component: RegisterDatasetDialogComponent;
  let fixture: ComponentFixture<RegisterDatasetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterDatasetDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterDatasetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
