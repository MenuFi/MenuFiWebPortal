import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricGraphComponent } from './metric-graph.component';

describe('MetricGraphComponent', () => {
  let component: MetricGraphComponent;
  let fixture: ComponentFixture<MetricGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
