import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../../../menu/menu.service';
import { Restaurant } from '../../../menu/restaurant.model';
import { MetricsService } from '../../metrics.service';
import { MenuItemClick } from '../metric-graph/menu-item-click.model';
import { Observable } from 'rxjs/Observable';
import { MenuItem } from '../../../menu/menu-item/menu-item.model';

@Component({
  selector: 'app-summary-graph',
  templateUrl: './summary-graph.component.html',
  styleUrls: ['./summary-graph.component.css']
})
export class SummaryGraphComponent implements OnInit {

  @Input() restaurantId: number;

  restaurantModel: Restaurant = null;
  menuItems: Observable<Array<MenuItem>>;
  metricsDict = {};
  totalClicks = 0;

  constructor(private menuService: MenuService, private metricsService: MetricsService) {
  }

  ngOnInit() {
    this.menuService.getRestaurants().subscribe((next) => {
      let i = 0;
      while (this.restaurantModel == null && i < next.length) {
        if (next[i].restaurantId == this.restaurantId) {
          this.restaurantModel = next[i];
        }
        i += 1;
      }
    });

    this.menuItems = this.menuService.getMenuItems(this.restaurantId);
    this.menuItems.subscribe((next) => {
      for (let i = 0; i < next.length; i += 1) {
        let menuItemId: number = next[i].menuItemId;
        this.metricsDict[menuItemId] = this.metricsService.getMenuItemClicks(this.restaurantId, menuItemId);
        this.metricsDict[menuItemId].subscribe((nextClicks) => {
          this.totalClicks += nextClicks.length;
        });
      }
    });
  }

}
