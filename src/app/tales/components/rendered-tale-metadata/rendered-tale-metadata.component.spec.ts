import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RenderedTaleMetadataComponent } from '@tales/components/rendered-tale-metadata/rendered-tale-metadata.component';

import { TaleRunButtonComponent } from './tale-run-button.component';

describe('RenderedTaleMetadataComponent', () => {
  let component: RenderedTaleMetadataComponent;
  let fixture: ComponentFixture<RenderedTaleMetadataComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RenderedTaleMetadataComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderedTaleMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
