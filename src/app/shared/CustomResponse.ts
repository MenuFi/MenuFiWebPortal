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
        let status: string = CustomResponse.getValueOrDefault<string>(response, "status", null);
        let data: E = CustomResponse.getValueOrDefault<E>(response, "data", null);
        let message: string = CustomResponse.getValueOrDefault<string>(response, "message", null);

        return new CustomResponse<E>(status, data, message);
    }

    static getValueOrDefault<E>(dict: object, key: string, def: E): E {
        return (key in dict) ? (dict[key] as E) : def;
    }
}