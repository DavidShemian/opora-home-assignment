export abstract class Exception extends Error {
    private _code: number;
    private _internalCode: number;
    private _message: string;
    private _params: any;

    public get code(): number {
        return this._code;
    }

    public get internalCode(): number {
        return this._internalCode;
    }

    public get message(): string {
        return this._message;
    }
    public get params(): any {
        return this._params;
    }

    protected constructor(prefix: number, code: number, message: string, params?: any) {
        super();

        this._internalCode = code;
        this._code = prefix + code;
        this._message = message;
        this._params = params;

        logger.error(message, { prefix, code, params });
    }
}
