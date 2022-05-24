import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecordedRunInfoDialogComponent } from './recorded-run-info-dialog.component';

describe('RecordedRunInfoDialogComponent', () => {
  let component: RecordedRunInfoDialogComponent;
  let fixture: ComponentFixture<RecordedRunInfoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RecordedRunInfoDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordedRunInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
