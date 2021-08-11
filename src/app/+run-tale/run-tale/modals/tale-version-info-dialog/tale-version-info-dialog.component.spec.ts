import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaleVersionInfoDialogComponent } from './tale-version-info-dialog.component';

describe('TaleVersionInfoDialogComponent', () => {
  let component: TaleVersionInfoDialogComponent;
  let fixture: ComponentFixture<TaleVersionInfoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaleVersionInfoDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleVersionInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
