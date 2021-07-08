import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublishTaleDialogComponent } from './publish-tale-dialog.component';

describe('PublishTaleDialogComponent', () => {
  let component: PublishTaleDialogComponent;
  let fixture: ComponentFixture<PublishTaleDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PublishTaleDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishTaleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
