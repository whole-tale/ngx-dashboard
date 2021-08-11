import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaleCatalogComponent } from './tale-catalog.component';

describe('TaleCatalogComponent', () => {
  let component: TaleCatalogComponent;
  let fixture: ComponentFixture<TaleCatalogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaleCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
