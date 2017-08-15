import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGraphComponent } from './map-graph.component';

describe('MapGraphComponent', () => {
  let component: MapGraphComponent;
  let fixture: ComponentFixture<MapGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
