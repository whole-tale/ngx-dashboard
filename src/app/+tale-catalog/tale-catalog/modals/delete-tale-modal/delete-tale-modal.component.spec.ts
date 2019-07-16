import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTaleModalComponent } from './delete-tale-modal.component';

describe('DeleteTaleModalComponent', () => {
  let component: DeleteTaleModalComponent;
  let fixture: ComponentFixture<DeleteTaleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteTaleModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
