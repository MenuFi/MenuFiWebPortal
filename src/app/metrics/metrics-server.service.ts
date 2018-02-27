import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { MetricsService } from './metrics.service';
import { Metric } from './metrics-dash/metric-graph/metric.model';

@Injectable()
export class MetricsServerService extends MetricsService {
    public getMetrics(restaurantId: number, menuItemId: number): Observable<Array<Metric>> {
        throw new Error("Method not implemented.");
    }
}
