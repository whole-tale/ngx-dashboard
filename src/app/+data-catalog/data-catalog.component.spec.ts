import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCatalogComponent } from './data-catalog.component';

describe('DataCatalogComponent', () => {
  let component: DataCatalogComponent;
  let fixture: ComponentFixture<DataCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
