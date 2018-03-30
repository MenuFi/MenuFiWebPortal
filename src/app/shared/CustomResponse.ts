export class CustomResponse<T> {
    public status: string;
    public data: T;
    public message: string;

    constructor(status: string, data: T, message: string) {
        this.status= status;
        this.data = data;
        this.message = message;
    }

    static fromResponse<E>(response: object): CustomResponse<E> {
        return CustomResponse.fromResponseMap<E>(response, (value: any, context: any) => { return CustomResponse.defaultMap<E>(value, this); }, this);
    }

    static fromResponseMap<E>(response: object, mapFunc: (value: any, context: any) => E, context: any): CustomResponse<E> {
        let status: string = CustomResponse.getValueOrDefault<string>(response, "status", null, CustomResponse.stringMap, context);
        let data: E = CustomResponse.getValueOrDefault<E>(response, "data", null, mapFunc, context);
        let message: string = CustomResponse.getValueOrDefault<string>(response, "message", null, CustomResponse.stringMap, context);

        return new CustomResponse<E>(status, data, message);
    }

    static getValueOrDefault<E>(dict: object, key: string, def: E, mapFunc: (value: any, context: any) => E, context: any): E {
        return (key in dict) ? mapFunc(dict[key], context) : def;
    }

    static stringMap(value: any, context): string {
        return value ? value.toString() : null;
    }

    static defaultMap<E>(value: any, context): E {
        return value ? value as E : null;
    }
}