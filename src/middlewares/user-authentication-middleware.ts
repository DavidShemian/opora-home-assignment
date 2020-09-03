import { NextFunction, Request, Response } from 'express';
import { config } from '../configs/config';
import { AuthenticationException } from '../exceptions/authentication-exception';
import { User } from '../models/db-models/user';
import { ErrorCodes, ResponseService } from '../services/response-service';
import { TokenService } from '../services/token-service';

export const userAuthenticationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization;

    if (!token) {
        return ResponseService.responseError(response, ErrorCodes.UNAUTHORIZED, { message: 'User not authorized' });
    }

    try {
        const userPayload = TokenService.verifyToken(token, config.TOKEN_SECRET_KEY);
        request.user = userPayload as User;

        next();
    } catch (error) {
        if (error instanceof AuthenticationException) {
            return ResponseService.responseError(response, ErrorCodes.UNAUTHORIZED, { message: 'user not authorized' });
        }

        throw error;
    }
};
