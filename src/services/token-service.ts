import { sign, verify } from 'jsonwebtoken';
import { AuthenticationException } from '../exceptions/authentication-exception';
import { AuthenticationExceptionCodes } from './../exceptions/authentication-exception';

enum JWTErrors {
    INVALID_TOKEN = 'invalid token',
}

export abstract class TokenService {
    public static generateToken(payload: any, secretKey: string, expiresIn: string): string {
        return TokenService.generateTokenUsingJWT(payload, secretKey, expiresIn);
    }

    public static verifyToken(token: string, secretKey: string): string | object {
        return TokenService.verifyTokenUsingJWT(token, secretKey);
    }

    private static generateTokenUsingJWT(payload: any, secretKey: string, expiresIn: string): string {
        return sign(payload, secretKey, { expiresIn });
    }

    private static verifyTokenUsingJWT(token: string, secretKey: string): string | object {
        try {
            return verify(token, secretKey);
        } catch (error) {
            if (error.message === JWTErrors.INVALID_TOKEN) {
                throw new AuthenticationException(AuthenticationExceptionCodes.INVALID_TOKEN, 'Invalid token', { token });
            }

            throw error;
        }
    }
}
