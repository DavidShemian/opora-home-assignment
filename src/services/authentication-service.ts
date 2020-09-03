import { AuthenticationDal } from '../DAL/authentication-dal';
import { AuthenticationException, AuthenticationExceptionCodes } from '../exceptions/authentication-exception';
import { config } from './../configs/config';
import { User } from './../models/db-models/user';
import { HashService } from './hash-service';
import { TokenService } from './token-service';

export class AuthenticationService {
    private authenticationDal: AuthenticationDal;

    constructor() {
        this.authenticationDal = new AuthenticationDal();
    }

    public async login(email: string, password: string): Promise<string> {
        const userWithSameEmail = await this.getUserByEmail(email);

        if (!userWithSameEmail) {
            throw this.getUserNotFoundException(email);
        }

        const isPasswordMatch = await HashService.compare(password, userWithSameEmail.password);

        if (!isPasswordMatch) {
            throw this.getUserNotFoundException(email);
        }

        // Remove password from token;
        const tokenPayload = { ...userWithSameEmail, password: '' };
        const userToken = TokenService.generateToken(tokenPayload, config.TOKEN_SECRET_KEY, config.TOKEN_EXPIRES_TIME);

        return userToken;
    }

    public async register(email: string, password: string): Promise<User> {
        const userWithSameEmail = await this.getUserByEmail(email);

        if (userWithSameEmail) {
            throw new AuthenticationException(AuthenticationExceptionCodes.USER_ALREADY_EXIST, 'User already exist');
        }

        const newUser = await User.getNewUser(email, password);

        const newUserInsertResult = await this.authenticationDal.insertUser(newUser);

        if (!newUserInsertResult) {
            throw new AuthenticationException(AuthenticationExceptionCodes.UNABLE_TO_CREATE_USER, 'Unable to create user');
        }

        return newUserInsertResult;
    }

    private async getUserByEmail(email: string): Promise<User | undefined> {
        return this.authenticationDal.getUserByEmail(email);
    }

    private getUserNotFoundException(email: string): AuthenticationException {
        return new AuthenticationException(AuthenticationExceptionCodes.UNABLE_TO_FIND_USER, 'User not found', { email });
    }
}
