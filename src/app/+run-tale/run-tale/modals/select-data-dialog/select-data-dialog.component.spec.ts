import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDataDialogComponent } from './select-data-dialog.component';

describe('SelectDataDialogComponent', () => {
  let component: SelectDataDialogComponent;
  let fixture: ComponentFixture<SelectDataDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectDataDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
