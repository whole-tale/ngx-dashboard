import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaleMetadataComponent } from './tale-metadata.component';

describe('TaleMetadataComponent', () => {
  let component: TaleMetadataComponent;
  let fixture: ComponentFixture<TaleMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaleMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
