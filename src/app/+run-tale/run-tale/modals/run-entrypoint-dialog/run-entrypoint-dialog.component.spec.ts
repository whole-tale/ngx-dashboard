import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RunEntrypointDialogComponent } from './run-entrypoint-dialog.component';

describe('RunEntrypointDialogComponent', () => {
  let component: RunEntrypointDialogComponent;
  let fixture: ComponentFixture<RunEntrypointDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RunEntrypointDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunEntrypointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
