import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaleInteractComponent } from './tale-interact.component';

describe('TaleInteractComponent', () => {
  let component: TaleInteractComponent;
  let fixture: ComponentFixture<TaleInteractComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaleInteractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleInteractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
