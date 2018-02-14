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
        return CustomResponse.fromResponseMap<E>(response, (value: any) => { return CustomResponse.defaultMap<E>(value); });
    }

    static fromResponseMap<E>(response: object, mapFunc: (value: any) => E) {
        let status: string = CustomResponse.getValueOrDefault<string>(response, "status", null, CustomResponse.stringMap);
        let data: E = CustomResponse.getValueOrDefault<E>(response, "data", null, mapFunc);
        let message: string = CustomResponse.getValueOrDefault<string>(response, "message", null, CustomResponse.stringMap);

        return new CustomResponse<E>(status, data, message);
    }

    static getValueOrDefault<E>(dict: object, key: string, def: E, mapFunc: (value: any) => E): E {
        return (key in dict) ? mapFunc(dict[key]) : def;
    }

    static stringMap(value: any): string {
        return value ? value.toString() : null;
    }

    static defaultMap<E>(value: any): E {
        return value ? value as E : null;
    }
}