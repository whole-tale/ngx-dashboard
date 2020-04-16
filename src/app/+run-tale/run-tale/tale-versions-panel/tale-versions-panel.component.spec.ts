import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaleVersionsPanelComponent } from './tale-versions-panel.component';

describe('TaleVersionsPanelComponent', () => {
  let component: TaleVersionsPanelComponent;
  let fixture: ComponentFixture<TaleVersionsPanelComponent>;

  beforeEach(async(() => {
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
