export class Restaurant {
    public restaurantId: number;
    public name: string;
    public price: number;
    public pictureUri: string;

    public constructor(restaurantId: number, name: string, price: number, pictureUri: string) {
        this.restaurantId = restaurantId;
        this.name = name;
        this.price = price;
        this.pictureUri = pictureUri;
    }
}
