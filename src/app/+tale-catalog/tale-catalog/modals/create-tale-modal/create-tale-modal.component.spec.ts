import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateTaleModalComponent } from './create-tale-modal.component';

describe('CreateTaleModalComponent', () => {
  let component: CreateTaleModalComponent;
  let fixture: ComponentFixture<CreateTaleModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTaleModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
