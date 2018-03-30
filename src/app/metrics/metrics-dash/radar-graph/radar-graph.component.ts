import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import { MenuItemClick } from '../metric-graph/menu-item-click.model';
import { MenuItem } from '../../../menu/menu-item/menu-item.model';
import { MenuService } from '../../../menu/menu.service';
import { Chart } from 'chart.js';
import { MetricsService } from '../../metrics.service';
import { DietaryPreference } from '../../../menu/menu-item/dietary-preference.model';

@Component({
  selector: 'app-radar-graph',
  templateUrl: './radar-graph.component.html',
  styleUrls: ['./radar-graph.component.css']
})

export class RadarGraphComponent implements OnInit {
  @Input() restaurantId: number;
  metricsDict = {};
  menuItems: Array<MenuItem>;
  menuItemMasks: Array<boolean>;
  pendingGets: number = 0;
  selectedMenuItems: Array<MenuItem>;
  poles: Array<String>;
  chart: Chart;
  colors: Array<String>;

  @ViewChild("myRadar") canvasElement: ElementRef;

  constructor(private menuService: MenuService, private metricsService: MetricsService) {
    this.menuItems = [];
    this.menuItemMasks = [];
    this.selectedMenuItems = [];
    this.poles = [];
    this.colors = ["#00ADF9", "#666699", "#ff99cc", "#ff9933", "#cc3300", "#99ff99", "#00ffff"];
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.chart = new Chart(this.canvasElement.nativeElement, {
      type: 'radar',
      data: {
        labels: [],
        datasets: [
          { 
            data: [],
            fill: false
          },
        ]
      }
    });

    this.updateMenuItems();
  }

  trackByIndex(index: number, value: any) {
    return index;
  }

  parseData(next, map, ts) {
    let sortedRadars = next.sort((a: MenuItemClick, b: MenuItemClick) => {
      if (a.getTimestampDate() > b.getTimestampDate()) {return 1;}
      if (a.getTimestampDate() < b.getTimestampDate()) {return -1;}
      return 0;
    })
    let dietArray = this.menuService.getMenuItem(this.restaurantId,next[0]['menuItemId'])['value']['dietaryPreferences']
    sortedRadars.forEach((res) => {
      if (res.getTimestampDate() >= ts) {
        for(let i = 0; i < dietArray.length; i++) {
          for(let j = 0; j < map.length; j++) {
            if (dietArray[i] == map[j]['id']) {
              map[j]['val'] += 1;
            }
          }
        }
      } 
    });
    return map;
  }

  private getSelectedMenuItems(): MenuItem[] {
    return this.menuItems.filter((menuItem: MenuItem, index: number, menuItems: MenuItem[]) => {
      return this.menuItemMasks[index];
    });
  }
  
  private updateMenuItems(): void {
    this.pendingGets += 1;
    this.menuService.getMenuItems(this.restaurantId).subscribe((next) => {
      this.pendingGets -= 1;
      this.menuItems = next;
      this.metricsDict = {};
      this.menuItems.forEach((menuItem: MenuItem, index: number, menuItems: MenuItem[]) => {
        this.menuItemMasks[index] = true;
      });
      this.updateRadars();
    });
  }

  private updateRadars(): void {
    let relevantMenuItems = this.getSelectedMenuItems();
    this.pendingGets += relevantMenuItems.length;
    relevantMenuItems.forEach((menuItem: MenuItem, index: number, menuItems: MenuItem[]) => {
      this.metricsDict[menuItem.menuItemId] = [];
      this.metricsService.getMenuItemClicks(this.restaurantId, menuItem.menuItemId).subscribe((nextRadars) => {
        this.metricsDict[menuItem.menuItemId] = nextRadars;
        this.pendingGets -= 1;
        this.updateChart();
      });
    });
  }

  private updateChart(): void {
    if (this.chart && this.pendingGets === 0) {
      // TODO: Update this to graph multiple data points
      this.selectedMenuItems = this.getSelectedMenuItems();
      let maxTimeStamp = new Date();
      maxTimeStamp.setHours(maxTimeStamp.getHours() - 50);
      maxTimeStamp.setMinutes(0);

      let dataSets = [];

      let struct = this.menuService.getAllPreferences()
      for (var z = 0; z < struct['value'].length; z++) {
        dataSets.push({id : struct['value'][z]['dietaryPreferenceId'], val : 0})
        this.poles.push(struct['value'][z]['name']);
      }
      this.chart.data.labels = this.poles;
      
      if (this.selectedMenuItems.length > 0) {
        for (let j = 0; j < this.selectedMenuItems.length; j += 1) {
          let data = this.parseData(this.metricsDict[this.selectedMenuItems[j].menuItemId], dataSets, maxTimeStamp);
          dataSets = data;
        }
        let pack = [];
        for (let k = 0; k < dataSets.length; k++) {
          pack.push(dataSets[k]['val']);
        }

        this.chart.config.data.datasets[0].borderColor = "#666699";
        this.chart.options.legend.display = false;
        this.chart.config.data.datasets[0].data = pack;
        this.chart.update();
      }
    }

  }

}

