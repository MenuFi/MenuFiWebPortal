import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import { MenuItemClick } from './menu-item-click.model';
import { MenuItem } from '../../../menu/menu-item/menu-item.model';
import { MenuService } from '../../../menu/menu.service';
import { Chart } from 'chart.js';
import { MetricsService } from '../../metrics.service';

@Component({
  selector: 'app-metric-graph',
  templateUrl: './metric-graph.component.html',
  styleUrls: ['./metric-graph.component.css']
})

export class MetricGraphComponent implements OnInit {
  @Input() restaurantId: number;
  metricsDict = {};
  menuItems: Array<MenuItem>;
  menuItemMasks: Array<boolean>;
  pendingGets: number = 0;
  currentMenuItem: MenuItem; // TODO: Remove when we can graph multiple menu items
  chart: Chart;

  @ViewChild("myCanvas") canvasElement: ElementRef;

  constructor(private menuService: MenuService, private metricsService: MetricsService) {
    this.menuItems = [];
    this.menuItemMasks = [];
  }

  ngOnInit() {
    this.updateMenuItems();
  }

  ngAfterViewInit() {
    this.chart = new Chart(this.canvasElement.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          { 
            data: [],
            borderColor: "#3cba9f",
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true,
            ticks: {
              min: 0,
              suggestedMax: 10
            }
          }],
        }
      }
    });
  }

  trackByIndex(index: number, value: any) {
    return index;
  }

  parseData(next) {
    let sortedMetrics = next.sort((a: MenuItemClick, b: MenuItemClick) => {
      if (a.getTimestampDate() > b.getTimestampDate()) {return 1;}
      if (a.getTimestampDate() < b.getTimestampDate()) {return -1;}
      return 0;
    })
    let maxTimeStamp = sortedMetrics[0].getTimestampDate();
    let bucketSizeMinutes = 120;
    maxTimeStamp.setMinutes(maxTimeStamp.getMinutes() + bucketSizeMinutes);
    maxTimeStamp.setMinutes(0);
    let xVal = [];
    let yVal = [];
    let ySum = 0;
    let date = -1;
    sortedMetrics.forEach((res) => {
      if (res.getTimestampDate() < maxTimeStamp) {
        ySum += 1;
      } else {
        if ((maxTimeStamp.getDate()) != date) {
          date = maxTimeStamp.getDate();
          xVal.push((maxTimeStamp.getMonth() + 1) + "/" + date + " " +  maxTimeStamp.getHours()  + ":00");
        } else {
          xVal.push(maxTimeStamp.getHours() + ":00");
        }
        yVal.push(ySum);
        ySum = 1;
        maxTimeStamp.setMinutes(maxTimeStamp.getMinutes() + bucketSizeMinutes);
        // console.log(maxTimeStamp.getMinutes());
        // console.log(ySum)
      }
    });
    return {
      xVal: xVal,
      yVal: yVal
    }
  }
  
  private updateMenuItems(): void {
    this.pendingGets += 1;
    this.menuService.getMenuItems(this.restaurantId).subscribe((next) => {
      this.pendingGets -= 1;
      this.menuItems = next;
      this.metricsDict = {};
      this.menuItems.forEach((menuItem: MenuItem, index: number, menuItems: MenuItem[]) => {
        this.menuItemMasks[index] = false;
      });
    });
  }

  private updateMetrics(): void {
    this.menuItems.forEach((menuItem: MenuItem, index: number, menuItems: MenuItem[]) => {
      // Only update metrics for the selected menu items
      if (this.menuItemMasks[index]) {
        this.pendingGets += 1;
        this.metricsDict[menuItem.menuItemId] = [];
        this.metricsService.getMenuItemClicks(this.restaurantId, menuItem.menuItemId).subscribe((nextMetrics) => {
          this.metricsDict[menuItem.menuItemId] = nextMetrics;
          this.pendingGets -= 1;
          if (this.pendingGets === 0) {
            this.updateChart();
          }
        });
      }
    });
  }

  private updateChart(): void {
    console.log("Update")
    if (this.chart && this.pendingGets === 0) {
      // TODO: Update this to graph multiple data points
      this.currentMenuItem = null;
      for (let i = 0; i < this.menuItemMasks.length; i += 1) {
        if (this.menuItemMasks[i] && !this.currentMenuItem) {
          this.currentMenuItem = this.menuItems[i];
        }
      }

      if (this.currentMenuItem) {
        let data = this.parseData(this.metricsDict[this.currentMenuItem.menuItemId])
        this.chart.data.labels = data.xVal;
        this.chart.data.datasets[0].data = data.yVal;
        this.chart.update();
      }
    }

  }

}
