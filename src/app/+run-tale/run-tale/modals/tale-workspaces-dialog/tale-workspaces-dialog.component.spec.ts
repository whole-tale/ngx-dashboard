import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaleWorkspacesDialogComponent } from './tale-workspaces-dialog.component';

describe('TaleWorkspacesDialogComponent', () => {
  let component: TaleWorkspacesDialogComponent;
  let fixture: ComponentFixture<TaleWorkspacesDialogComponent>;

  beforeEach(async(() => {
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
