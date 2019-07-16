import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaleModalComponent } from './create-tale-modal.component';

describe('CreateTaleModalComponent', () => {
  let component: CreateTaleModalComponent;
  let fixture: ComponentFixture<CreateTaleModalComponent>;

  beforeEach(async(() => {
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
