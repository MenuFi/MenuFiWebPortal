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

  parseData(next, timeStamp: Date) {
    let sortedMetrics = next.sort((a: MenuItemClick, b: MenuItemClick) => {
      if (a.getTimestampDate() > b.getTimestampDate()) {return 1;}
      if (a.getTimestampDate() < b.getTimestampDate()) {return -1;}
      return 0;
    })
    let maxTimeStamp = new Date(timeStamp.getTime())
    let minTimeStamp = new Date(timeStamp.getTime())
    let bucketSizeMinutes = 120;
    maxTimeStamp.setMinutes(maxTimeStamp.getMinutes() + bucketSizeMinutes);
    let xVal = [];
    let yVal = [];
    let ySum = 0;
    let date = -1;
    sortedMetrics.forEach((res) => {
      if (res.getTimestampDate() >= minTimeStamp && res.getTimestampDate() < maxTimeStamp) {
        ySum += 1;
      } else if (res.getTimestampDate() > maxTimeStamp) {
        minTimeStamp.setMinutes(minTimeStamp.getMinutes() + bucketSizeMinutes);
        maxTimeStamp.setMinutes(maxTimeStamp.getMinutes() + bucketSizeMinutes);
        while (res.getTimestampDate() > maxTimeStamp) {
          ySum = 0;
          yVal.push(ySum);
          if ((maxTimeStamp.getDate()) != date) {
            date = maxTimeStamp.getDate();
            xVal.push((maxTimeStamp.getMonth() + 1) + "/" + date + " " +  maxTimeStamp.getHours()  + ":00");
          } else {
            xVal.push(maxTimeStamp.getHours() + ":00");
          }
          minTimeStamp.setMinutes(minTimeStamp.getMinutes() + bucketSizeMinutes);
          maxTimeStamp.setMinutes(maxTimeStamp.getMinutes() + bucketSizeMinutes);
        }
        if ((maxTimeStamp.getDate()) != date) {
          date = maxTimeStamp.getDate();
          xVal.push((maxTimeStamp.getMonth() + 1) + "/" + date + " " +  maxTimeStamp.getHours()  + ":00");
        } else {
          xVal.push(maxTimeStamp.getHours() + ":00");
        }
        yVal.push(ySum);
        ySum = 1;
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
      this.metricsDict[menuItem.menuItemId] = [];
      this.metricsService.getMenuItemClicks(this.restaurantId, menuItem.menuItemId).subscribe((nextMetrics) => {
        this.metricsDict[menuItem.menuItemId] = nextMetrics;
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

      // if (this.selectedMenuItems.length > 0) {
      //   let data = this.parseData(this.metricsDict[this.currentMenuItem.menuItemId], maxTimeStamp)
      //   this.chart.data.labels = data.xVal;
      //   this.chart.data.datasets[0].data = data.yVal;
      //   this.chart.update();
      // }
    }

  }

}
