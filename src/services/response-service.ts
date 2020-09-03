import { Response } from 'express';

export enum ErrorCodes {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    CONFLICT = 409,
}

export enum SuccessCodes {
    OK = 200,
    CREATED = 201,
}

export abstract class ResponseService {
    public static responseError(response: Response, errorCode: ErrorCodes, body: object): void {
        logger.info('responding error', { errorCode, body });

        response.status(errorCode).json(body);
    }

    public static responseSuccess(response: Response, successCode: SuccessCodes, body: object): void {
        logger.info('responding success', { successCode, body });

        response.status(successCode).json(body);
    }
}
