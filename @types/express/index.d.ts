/**
 * Uses typescript deceleration merging in order to
 * modify express properties
 */

import { User } from './../../src/models/db-models/user';

declare global {
    namespace Express {
        interface Request {
            // Adds user to request
            user: User;
        }
    }
}
