import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerEngineComponent } from './viewer-engine.component';

describe('ViewerEngineComponent', () => {
  let component: ViewerEngineComponent;
  let fixture: ComponentFixture<ViewerEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
