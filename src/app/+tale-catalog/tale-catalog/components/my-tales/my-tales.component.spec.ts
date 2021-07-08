import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyTalesComponent } from './my-tales.component';

describe('MyTalesComponent', () => {
  let component: MyTalesComponent;
  let fixture: ComponentFixture<MyTalesComponent>;

  beforeEach(waitForAsync(() => {
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
