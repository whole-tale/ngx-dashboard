import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaleVersionInfoDialogComponent } from './tale-version-info-dialog.component';

describe('TaleVersionInfoDialogComponent', () => {
  let component: TaleVersionInfoDialogComponent;
  let fixture: ComponentFixture<TaleVersionInfoDialogComponent>;

  beforeEach(async(() => {
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
