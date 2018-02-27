import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsDashComponent } from './metrics-dash.component';

describe('MetricsDashComponent', () => {
  let component: MetricsDashComponent;
  let fixture: ComponentFixture<MetricsDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
