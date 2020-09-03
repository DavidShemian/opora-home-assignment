import { Exception } from './exception';

export enum CreationExceptionCodes {
    USER_ALREADY_EXIST = 8000,
    UNABLE_TO_CREATE_USER = 8100,
}

export class CreationException extends Exception {
    private static CODE_PREFIX = 80000;
    private _detail: string;

    public get detail(): string {
        return this._detail;
    }

    constructor(code: CreationExceptionCodes, message: string, detail: string, params?: any) {
        super(CreationException.CODE_PREFIX, code, message, params);

        this._detail = detail;
    }
}
