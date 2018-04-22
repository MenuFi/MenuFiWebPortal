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
  toggleSwitch: Array<String>
  toggleBinary: boolean = true;

  @ViewChild("myCanvas") canvasElement: ElementRef;

  constructor(private menuService: MenuService, private metricsService: MetricsService) {
    this.menuItems = [];
    this.menuItemMasks = [];
    this.selectedMenuItems = [];
    this.colors = ["#00ADF9", "#666699", "#ff99cc", "#ff9933", "#cc3300", "#99ff99", "#00ffff"];
    this.toggleSwitch = ["Show All", "Hide All"];
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

  parseData(next, map) {
    let sortedMetrics = next.sort((a: MenuItemClick, b: MenuItemClick) => {
      if (a.getTimestampDate() > b.getTimestampDate()) {return 1;}
      if (a.getTimestampDate() < b.getTimestampDate()) {return -1;}
      return 0;
    })
    let counter = 0;
    let yVal = [];
    let ySum = 0;
    let outRange = 0;
    let yTotal = 0;
    let date = -1;
    sortedMetrics.forEach((res) => {
      if (counter < map.length - 1) {
        if (res.getTimestampDate() >= map[counter].dateValue && res.getTimestampDate() < map[counter + 1].dateValue) {
          ySum += 1;
          yTotal += 1;
        } else if (res.getTimestampDate() > map[counter + 1].dateValue) {
          while (counter < map.length - 1 && res.getTimestampDate() > map[counter + 1].dateValue) {
            yVal.push(ySum);
            counter += 1;
            ySum = 0;
          }
          yTotal += 1;
          ySum += 1;
        } else {
          outRange += 1;
        }
      }
    });
    yVal.push(ySum);
    if (yVal.length < map.length) {
      for(let j = yVal.length; j < map.length; j++) {
        yVal.push(0);
      }
    }
    // console.log(xVal);
    return {
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
      this.metricsDict[menuItem.menuItemId] = [];
      this.metricsService.getMenuItemClicks(this.restaurantId, menuItem.menuItemId).subscribe((nextMetrics) => {
        this.metricsDict[menuItem.menuItemId] = nextMetrics;
        this.pendingGets -= 1;
        this.updateChart();
      });
    });
  }

  private getXcolumns() {
    let maxTimeStamp = new Date();
    let endPoint = new Date(maxTimeStamp);
    maxTimeStamp.setHours(maxTimeStamp.getHours() - 50);
    maxTimeStamp.setMinutes(0);
    let map = [];
    let bucketSizeMinutes = 120;
    let date = -1;
    while(maxTimeStamp < endPoint) {
      let current = new Date(maxTimeStamp);
      if (maxTimeStamp.getDate() != date || map.length == 1) {
        date = maxTimeStamp.getDate();
        map.push({label : (maxTimeStamp.getMonth() + 1) + "/" + date + " " +  maxTimeStamp.getHours()  + ":00", dateValue : current});
      } else {
        let maybe = new Date(maxTimeStamp);
        map.push({label : maxTimeStamp.getHours()  + ":00", dateValue : current});
      }
      maxTimeStamp.setMinutes(maxTimeStamp.getMinutes() + bucketSizeMinutes);
    }
    return map;
  }

  private updateChart(): void {
    if (this.chart && this.pendingGets === 0) {
      // TODO: Update this to graph multiple data points
      this.selectedMenuItems = this.getSelectedMenuItems();
      let maxTimeStamp = new Date();
      maxTimeStamp.setHours(maxTimeStamp.getHours() - 50);
      maxTimeStamp.setMinutes(0);
      let map = this.getXcolumns();

      let xVal = [];
      for (let k = 0; k < map.length; k += 1) {
        xVal.push(map[k].label);
      }
      xVal.shift();

      let dataSets = [];
      
      if (this.selectedMenuItems.length > 0) {
        for (let j = 0; j < this.selectedMenuItems.length; j += 1) {
          let data = this.parseData(this.metricsDict[this.selectedMenuItems[j].menuItemId], map)
          if (j == 0) {
            this.chart.data.labels = xVal;
          }
          dataSets.push({
            data: data.yVal,
            label: this.selectedMenuItems[j].name,
            borderColor: this.colors[j % 7],
            fill: false
          })
        }
        dataSets.push({
          data: [],
          label: "Hide All",
          borderColor: "#000000",
          fill: false
        })

        
        this.chart.data.datasets = dataSets;
        
        this.chart.options.legend.onClick = (e, legendItem) => {
          let i = legendItem.datasetIndex;
          let labels = this.chart.legend.legendItems;
          let meta = this.chart.getDatasetMeta(i);
          if (i == labels.length - 1) {
            for (let j = 0; j < i; j++) {
              let otherMeta = this.chart.getDatasetMeta(j);
              otherMeta.hidden = this.toggleBinary;
            }
            dataSets.pop();
            this.toggleBinary = !this.toggleBinary;
            let label = this.toggleBinary ? this.toggleSwitch[1] : this.toggleSwitch[0];
            dataSets.push({
              data: [],
              label: label,
              borderColor: "#000000",
              fill: false
            })

          } else {
            meta.hidden = meta.hidden === null ? !this.chart.data.datasets[i].hidden : null;
          }
          this.chart.update();
        };
        this.chart.update();
      }
    }

  }

}
