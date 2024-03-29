import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateRenameVersionDialogComponent } from './create-rename-version-dialog.component';

describe('CreateRenameVersionDialogComponent', () => {
  let component: CreateRenameVersionDialogComponent;
  let fixture: ComponentFixture<CreateRenameVersionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRenameVersionDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRenameVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
