import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetricsDashComponent } from './metrics-dash/metrics-dash.component';
import { AuthGuard } from '../auth-guard.service';

const metricsRoutes: Routes = [
    { 
      path: 'metrics',
      component: MetricsDashComponent,
      canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(metricsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MetricsRoutingModule { }