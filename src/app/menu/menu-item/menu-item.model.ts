import { DietaryPreference } from "./dietary-preference.model";

export class MenuItem {
    public menuItemId: number;
    public name: string;
    public price: number;
    public ingredients: Array<string>;
    public dietaryPreferences: Array<DietaryPreference>;
    public calories: number;
    public description: string;
    public rating: number;

    public constructor(menuItemId: number, name: string, price: number, ingredients: Array<string>, dietaryPreferences: Array<DietaryPreference>, calories: number, description: string, rating: number) {
        this.menuItemId = menuItemId;
        this.name = name;
        this.price = price;
        this.ingredients = ingredients;
        this.dietaryPreferences = dietaryPreferences;
        this.calories = calories;
        this.description = description;
        this.rating = rating;
    }
}
