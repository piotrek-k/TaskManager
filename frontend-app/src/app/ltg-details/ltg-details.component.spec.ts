import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LtgDetailsComponent } from './ltg-details.component';

describe('LtgDetailsComponent', () => {
  let component: LtgDetailsComponent;
  let fixture: ComponentFixture<LtgDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LtgDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LtgDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
