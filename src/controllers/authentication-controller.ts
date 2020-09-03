import { NextFunction, Request, Response, Router } from 'express';
import { userAuthenticationMiddleware } from '../middlewares/user-authentication-middleware';
import { ErrorCodes, ResponseService, SuccessCodes } from '../services/response-service';
import { AuthenticationException, AuthenticationExceptionCodes } from './../exceptions/authentication-exception';
import { AuthenticationService } from './../services/authentication-service';
import { BaseController } from './base-controller';

export class AuthenticationController extends BaseController {
    get router(): Router {
        return this._router;
    }

    private _router: Router;
    private authenticationService: AuthenticationService;
    private path = '/authentication';

    constructor(router: Router) {
        super();

        this._router = router;
        this.authenticationService = new AuthenticationService();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this._router.post(`${this.path}/register`, userAuthenticationMiddleware, this.register);
        this._router.post(`${this.path}/login`, this.login);
    }

    /**
     * Check if user exist and the credentials are correct,
     * and if so then returns a token made from the token info
     */
    private login = async (request: Request, response: Response, next: NextFunction) => {
        const { email, password } = request.body;

        if (!email || !password) {
            return ResponseService.responseError(response, ErrorCodes.BAD_REQUEST, { message: 'Must provide email and password' });
        }

        try {
            const token: string = await this.authenticationService.login(email, password.toString());

            return ResponseService.responseSuccess(response, SuccessCodes.OK, { token });
        } catch (error) {
            if (error instanceof AuthenticationException) {
                if (error.internalCode === AuthenticationExceptionCodes.UNABLE_TO_FIND_USER) {
                    return ResponseService.responseError(response, ErrorCodes.NOT_FOUND, { email, message: error.message });
                }
            }
            next(error);
        }
    };

    /**
     * Registers a new user,
     * and then returns a token made from the new user info
     * by logging the user in
     */
    private register = async (request: Request, response: Response, next: NextFunction) => {
        const { email, password } = request.body;

        if (!email || !password) {
            return ResponseService.responseError(response, ErrorCodes.BAD_REQUEST, { message: 'Must provide email and password' });
        }

        try {
            await this.authenticationService.register(email, password);

            const token = await this.authenticationService.login(email, password);

            return ResponseService.responseSuccess(response, SuccessCodes.CREATED, { token });
        } catch (error) {
            if (error instanceof AuthenticationException) {
                if (error.internalCode === AuthenticationExceptionCodes.USER_ALREADY_EXIST) {
                    return ResponseService.responseError(response, ErrorCodes.CONFLICT, { email, message: error.message });
                }
            }

            next(error);
        }
    };
}
