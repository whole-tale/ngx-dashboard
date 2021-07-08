import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteTaleModalComponent } from './delete-tale-modal.component';

describe('DeleteTaleModalComponent', () => {
  let component: DeleteTaleModalComponent;
  let fixture: ComponentFixture<DeleteTaleModalComponent>;

  beforeEach(waitForAsync(() => {
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
