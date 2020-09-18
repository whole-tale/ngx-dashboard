import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveToDialogComponent } from './move-to-dialog.component';

describe('MoveToDialogComponent', () => {
  let component: MoveToDialogComponent;
  let fixture: ComponentFixture<MoveToDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoveToDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveToDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
