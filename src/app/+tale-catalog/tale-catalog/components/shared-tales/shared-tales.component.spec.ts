import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTalesComponent } from './shared-tales.component';

describe('SharedTalesComponent', () => {
  let component: SharedTalesComponent;
  let fixture: ComponentFixture<SharedTalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
