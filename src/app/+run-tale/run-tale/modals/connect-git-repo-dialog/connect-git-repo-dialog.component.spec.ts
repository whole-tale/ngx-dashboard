import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConnectGitRepoDialogComponent } from './connect-git-repo-dialog.component';

describe('ConnectGitRepoDialogComponent', () => {
  let component: ConnectGitRepoDialogComponent;
  let fixture: ComponentFixture<ConnectGitRepoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectGitRepoDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectGitRepoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
