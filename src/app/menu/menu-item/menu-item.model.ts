export class MenuItem {
    public menuItemId: number;
    public name: string;
    public price: number;
    public ingredients: Array<string>;
    public calories: number;
    public description: string;
    public rating: number;

    public constructor(menuItemId: number, name: string, price: number, ingredients: Array<string>, calories: number, description: string, rating: number) {
        this.menuItemId = menuItemId;
        this.name = name;
        this.price = price;
        this.ingredients = ingredients;
        this.calories = calories;
        this.description = description;
        this.rating = rating;
    }
}
