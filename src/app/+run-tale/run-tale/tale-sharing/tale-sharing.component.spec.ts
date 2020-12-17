import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaleSharingComponent } from './tale-sharing.component';

describe('TaleSharingComponent', () => {
  let component: TaleSharingComponent;
  let fixture: ComponentFixture<TaleSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaleSharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
