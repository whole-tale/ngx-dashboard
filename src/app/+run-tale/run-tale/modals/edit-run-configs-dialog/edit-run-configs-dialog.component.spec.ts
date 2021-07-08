import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRunConfigsDialogComponent } from './edit-run-configs-dialog.component';

describe('EditRunConfigsDialogComponent', () => {
  let component: EditRunConfigsDialogComponent;
  let fixture: ComponentFixture<EditRunConfigsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditRunConfigsDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRunConfigsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
