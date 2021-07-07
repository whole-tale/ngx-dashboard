import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaleVersionsPanelComponent } from './tale-versions-panel.component';

describe('TaleVersionsPanelComponent', () => {
  let component: TaleVersionsPanelComponent;
  let fixture: ComponentFixture<TaleVersionsPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaleVersionsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleVersionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
