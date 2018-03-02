import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Metric } from './metric.model';
import { MenuItem } from '../../../menu/menu-item/menu-item.model';
import { MenuService } from '../../../menu/menu.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-metric-graph',
  templateUrl: './metric-graph.component.html',
  styleUrls: ['./metric-graph.component.css']
})

export class MetricGraphComponent implements OnInit, OnChanges {

  @Input() metrics: Array<Metric>;
  graphTime: string;
  menuItemModel: MenuItem;

  chart: Chart;

  @ViewChild("myCanvas") canvasElement: ElementRef;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.graphTime = "onInit"
    if (this.metrics) {
      this.update();
    }
  }

  ngAfterViewInit() {
    let data = this.parseData(this.metrics)
    this.chart = new Chart(this.canvasElement.nativeElement, {
      type: 'line',
      data: {
        labels: data.xVal,
        datasets: [
          { 
            data: data.yVal,
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
            display: true
          }],
        }
      }
    });
  }

  parseData(next) {
    let sortedMetrics = next.sort((a: Metric, b: Metric) => {
      if (a.getTimestampDate() > b.getTimestampDate()) {return 1;}
      if (a.getTimestampDate() < b.getTimestampDate()) {return -1;}
      return 0;
    })
    let maxTimeStamp = sortedMetrics[0].getTimestampDate();
    let bucketSizeMinutes = 120;
    maxTimeStamp.setMinutes(maxTimeStamp.getMinutes() + bucketSizeMinutes);
    let xVal = [];
    let yVal = [];
    let ySum = 0;
    sortedMetrics.forEach((res) => {
      if (res.getTimestampDate() < maxTimeStamp) {
        ySum += 1;
      } else {
        xVal.push(maxTimeStamp);
        yVal.push(ySum);
        ySum = 0;
        maxTimeStamp.setMinutes(maxTimeStamp.getMinutes() + bucketSizeMinutes);
      }
    });
    return {
      xVal: xVal,
      yVal: yVal
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
    if (this.chart) {
      let data = this.parseData(this.metrics)
      this.chart.data.labels = data.xVal;
      this.chart.data.datasets[0].data = data.yVal;
      this.chart.update();
    }

  }

}
