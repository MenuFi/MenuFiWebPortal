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
  selectedMenuItems: Array<MenuItem>;
  chart: Chart;
  colors: Array<String>;

  @ViewChild("myCanvas") canvasElement: ElementRef;

  constructor(private menuService: MenuService, private metricsService: MetricsService) {
    this.menuItems = [];
    this.menuItemMasks = [];
    this.selectedMenuItems = [];
    this.colors = ["#00ADF9", "#666699", "#ff99cc", "#ff9933", "#cc3300", "#99ff99", "#00ffff"];
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.chart = new Chart(this.canvasElement.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          { 
            data: [],
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: true,
          position: "left"
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

    this.updateMenuItems();
  }

  trackByIndex(index: number, value: any) {
    return index;
  }

  parseData(next, timeStamp: Date) {
    let sortedMetrics = next.sort((a: MenuItemClick, b: MenuItemClick) => {
      if (a.getTimestampDate() > b.getTimestampDate()) {return 1;}
      if (a.getTimestampDate() < b.getTimestampDate()) {return -1;}
      return 0;
    })
    let maxTimeStamp = new Date(timeStamp.getTime())
    let bucketSizeMinutes = 120;
    maxTimeStamp.setMinutes(maxTimeStamp.getMinutes() + bucketSizeMinutes);
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
      }
    });
    return {
      xVal: xVal,
      yVal: yVal
    }
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
      this.updateMetrics();
    });
  }

  private updateMetrics(): void {
    let relevantMenuItems = this.getSelectedMenuItems();
    this.pendingGets += relevantMenuItems.length;
    relevantMenuItems.forEach((menuItem: MenuItem, index: number, menuItems: MenuItem[]) => {
      console.log(menuItem.menuItemId);
      this.metricsDict[menuItem.menuItemId] = [];
      this.metricsService.getMenuItemClicks(this.restaurantId, menuItem.menuItemId).subscribe((nextMetrics) => {
        this.metricsDict[menuItem.menuItemId] = nextMetrics;
        this.pendingGets -= 1;
        this.updateChart();
      });
    });
  }

  private updateChart(): void {
    console.log(this.pendingGets);
    console.log(this.chart);
    console.log(this.pendingGets === 0);
    if (this.chart && this.pendingGets === 0) {
      // TODO: Update this to graph multiple data points
      this.selectedMenuItems = this.getSelectedMenuItems();

      let maxTimeStamp = new Date();
      maxTimeStamp.setHours(maxTimeStamp.getHours() - 48);
      maxTimeStamp.setMinutes(0);

      let dataSets = [];
      
      if (this.selectedMenuItems.length > 0) {
        for (let j = 0; j < this.selectedMenuItems.length; j += 1) {
          let data = this.parseData(this.metricsDict[this.selectedMenuItems[j].menuItemId], maxTimeStamp)
          if (j == 0) {
            this.chart.data.labels = data.xVal;
          }
          dataSets.push({
            data: data.yVal,
            label: this.selectedMenuItems[j].name,
            borderColor: this.colors[j % 7],
            fill: false
          })
        }

        
        this.chart.data.datasets = dataSets;
        this.chart.update();
      }

      // if (this.selectedMenuItems.length > 0) {
      //   let data = this.parseData(this.metricsDict[this.currentMenuItem.menuItemId], maxTimeStamp)
      //   this.chart.data.labels = data.xVal;
      //   this.chart.data.datasets[0].data = data.yVal;
      //   this.chart.update();
      // }
    }

  }

}
