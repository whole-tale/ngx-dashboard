import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaleRunButtonComponent } from './tale-run-button.component';

describe('TaleRunButtonComponent', () => {
  let component: TaleRunButtonComponent;
  let fixture: ComponentFixture<TaleRunButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaleRunButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleRunButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
