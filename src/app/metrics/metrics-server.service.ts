import { Observable } from 'rxjs/Observable'
import { MetricsService } from './metrics.service';
import { Metric } from './metrics-dash/metric/metric.model';

export class MetricsServerService extends MetricsService {
    public getMetrics(restaurantId: number, menuItemId: number): Observable<Array<Metric>> {
        throw new Error("Method not implemented.");
    }
}
