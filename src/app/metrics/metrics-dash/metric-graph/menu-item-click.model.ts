export class MenuItemClick {
    public metricId: number;
    public restaurantId: number;
    public menuItemId: number;
    public timestamp: string;

    constructor(metricId: number, restaurantId: number, menuItemId: number, timestamp: string) {
        this.metricId = metricId;
        this.restaurantId = restaurantId;
        this.menuItemId = menuItemId;
        this.timestamp = timestamp;
    }

    public getTimestampDate(): Date {
        return new Date(this.timestamp);
    }
}
