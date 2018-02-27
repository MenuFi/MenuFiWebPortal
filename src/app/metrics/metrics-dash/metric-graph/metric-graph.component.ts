import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Metric } from './metric.model';
import { MenuItem } from '../../../menu/menu-item/menu-item.model';
import { MenuService } from '../../../menu/menu.service';

@Component({
  selector: 'app-metric-graph',
  templateUrl: './metric-graph.component.html',
  styleUrls: ['./metric-graph.component.css']
})
export class MetricGraphComponent implements OnInit, OnChanges {

  @Input() metrics: Array<Metric>;
  graphTime: string;
  menuItemModel: MenuItem;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.graphTime = "onInit"
    if (this.metrics) {
      this.update();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  private update(): void {
    this.graphTime = Date.now().toString();
    if (this.metrics.length > 0) {
      this.menuService
        .getMenuItem(this.metrics[0].restaurantId, this.metrics[0].menuItemId)
        .subscribe((next: MenuItem) => {
          this.menuItemModel = next;
        });
    }
  }

}
