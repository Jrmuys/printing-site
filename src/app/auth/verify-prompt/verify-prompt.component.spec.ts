import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPromptComponent } from './verify-prompt.component';

describe('VerifyPromptComponent', () => {
  let component: VerifyPromptComponent;
  let fixture: ComponentFixture<VerifyPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
