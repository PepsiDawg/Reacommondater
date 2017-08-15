import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrGraphComponent } from './sr-graph.component';

describe('SrGraphComponent', () => {
  let component: SrGraphComponent;
  let fixture: ComponentFixture<SrGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
