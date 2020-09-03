import { Exception } from './exception';

export enum AuthenticationExceptionCodes {
    USER_ALREADY_EXIST = 4000,
    UNABLE_TO_CREATE_USER = 4100,
    INVALID_TOKEN = 4200,
    UNABLE_TO_FIND_USER = 4404,
}

export class AuthenticationException extends Exception {
    private static CODE_PREFIX = 40000;

    constructor(code: AuthenticationExceptionCodes, message: string, params?: any) {
        super(AuthenticationException.CODE_PREFIX, code, message, params);
    }
}
