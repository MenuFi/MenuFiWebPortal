import { Component, OnInit } from '@angular/core';
import { MenuItemClick } from './metric-graph/menu-item-click.model';
import { MetricsService } from '../metrics.service';

@Component({
  selector: 'app-metrics-dash',
  templateUrl: './metrics-dash.component.html',
  styleUrls: ['./metrics-dash.component.css']
})
export class MetricsDashComponent implements OnInit {

  metrics: Array<MenuItemClick>;

  constructor(private metricsService: MetricsService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.metricsService.getMenuItemClicks(1, 1).subscribe((next: Array<MenuItemClick>) => {
      this.metrics = next;
    });
  }

}
