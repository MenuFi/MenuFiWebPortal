import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { MetricsRoutingModule } from './metrics-routing.module';

import { environment } from '../../environments/environment';
import { MetricsDashComponent } from './metrics-dash/metrics-dash.component';
import { MetricComponent } from './metrics-dash/metric/metric.component';
import { MetricsService } from './metrics.service';
import { MetricsServerService } from './metrics-server.service';
import { MetricsMockService } from './metrics-mock.service';

let metricsServiceImpl = environment.production ? MetricsServerService : MetricsMockService;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MetricsRoutingModule
  ],
  declarations: [MetricsDashComponent, MetricComponent],
  providers: [{ provide: MetricsService, useClass: metricsServiceImpl }]
})
export class MetricsModule { }
