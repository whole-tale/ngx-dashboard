import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTalesComponent } from './my-tales.component';

describe('MyTalesComponent', () => {
  let component: MyTalesComponent;
  let fixture: ComponentFixture<MyTalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
