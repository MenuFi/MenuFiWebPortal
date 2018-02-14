export class AddMenuItem {
    public restaurantId: number;
    public name: string;
    public price: number;
    public ingredients: Array<string>;
    public dietaryPreferences: Array<number>;
    public calories: number;
    public description: string;
    public rating: number;
    public pictureUri: string;

    public constructor(restaurantId: number, name: string, price: number, ingredients: Array<string>, dietaryPreferences: Array<number>, calories: number, description: string, rating: number, pictureUri: string) {
        this.restaurantId = restaurantId;
        this.name = name;
        this.price = price;
        this.ingredients = ingredients;
        this.dietaryPreferences = dietaryPreferences;
        this.calories = calories;
        this.description = description;
        this.rating = rating;
        this.pictureUri = pictureUri;
    }
}
