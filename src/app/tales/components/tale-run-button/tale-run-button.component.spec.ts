import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaleRunButtonComponent } from './tale-run-button.component';

describe('TaleRunButtonComponent', () => {
  let component: TaleRunButtonComponent;
  let fixture: ComponentFixture<TaleRunButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TaleRunButtonComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleRunButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
