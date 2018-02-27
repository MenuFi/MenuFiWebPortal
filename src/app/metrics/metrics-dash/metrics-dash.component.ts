import { Component, OnInit } from '@angular/core';
import { Metric } from './metric-graph/metric.model';
import { MetricsService } from '../metrics.service';

@Component({
  selector: 'app-metrics-dash',
  templateUrl: './metrics-dash.component.html',
  styleUrls: ['./metrics-dash.component.css']
})
export class MetricsDashComponent implements OnInit {

  metrics: Array<Metric>;

  constructor(private metricsService: MetricsService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.metricsService.getMetrics(1, 1).subscribe((next: Array<Metric>) => {
      this.metrics = next;
    });
  }

}
