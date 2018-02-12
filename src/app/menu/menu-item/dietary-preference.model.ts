export class DietaryPreference {
    public dietaryPreferenceId: number;
    public name: string;
    public type: number;

    constructor(dietaryPreferenceId: number, name: string, type: number) {
        this.dietaryPreferenceId = dietaryPreferenceId;
        this.name = name;
        this.type = type;
    }

    public isRestriction(): boolean {
        return this.type == 1;
    }
}

DietaryPreference.prototype.valueOf = function() {
    return this.dietaryPreferenceId;
}