import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaleFilesComponent } from './tale-files.component';

describe('TaleFilesComponent', () => {
  let component: TaleFilesComponent;
  let fixture: ComponentFixture<TaleFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaleFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
