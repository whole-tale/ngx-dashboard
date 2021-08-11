import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaleWorkspacesDialogComponent } from './tale-workspaces-dialog.component';

describe('TaleWorkspacesDialogComponent', () => {
  let component: TaleWorkspacesDialogComponent;
  let fixture: ComponentFixture<TaleWorkspacesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaleWorkspacesDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleWorkspacesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
