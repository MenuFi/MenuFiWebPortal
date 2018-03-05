import { Component, OnInit } from '@angular/core';
import { MetricsService } from '../metrics.service';

@Component({
  selector: 'app-metrics-dash',
  templateUrl: './metrics-dash.component.html',
  styleUrls: ['./metrics-dash.component.css']
})
export class MetricsDashComponent implements OnInit {

  restaurantId: number;

  constructor(private metricsService: MetricsService) { }

  ngOnInit() {
    this.restaurantId = 1;
  }

}
