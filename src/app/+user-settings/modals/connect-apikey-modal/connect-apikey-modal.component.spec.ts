import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectApiKeyModalComponent } from './connect-apikey-modal.component';

describe('ConnectApiKeyModalComponent', () => {
  let component: ConnectApiKeyModalComponent;
  let fixture: ComponentFixture<ConnectApiKeyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectApiKeyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectApiKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
