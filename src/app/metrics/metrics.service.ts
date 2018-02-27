import { Observable } from 'rxjs/Observable';
import { Metric } from './metrics-dash/metric-graph/metric.model';

export abstract class MetricsService {
    public abstract getMetrics(restaurantId: number, menuItemId: number): Observable<Array<Metric>>;
}
