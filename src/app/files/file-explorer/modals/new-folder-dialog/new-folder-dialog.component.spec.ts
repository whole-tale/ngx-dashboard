import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewFolderDialogComponent } from './new-folder-dialog.component';

describe('NewFolderDialogComponent', () => {
  let component: NewFolderDialogComponent;
  let fixture: ComponentFixture<NewFolderDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NewFolderDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
