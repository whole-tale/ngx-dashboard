import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLogsDialogComponent } from './view-logs-dialog.component';

describe('ViewLogsDialogComponent', () => {
  let component: ViewLogsDialogComponent;
  let fixture: ComponentFixture<ViewLogsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewLogsDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLogsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
