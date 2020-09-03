import { CreationException, CreationExceptionCodes } from './../exceptions/creation-exception';
import { dbExceptionCodes } from './../exceptions/db/db-exception-codes';
import { User } from './../models/db-models/user';
import { BaseDal } from './base-dal';

export class AuthenticationDal extends BaseDal {
    /**
     * returns a user by it email
     * uses lowercase for both email input and the email inside the db
     * @param email email to search
     */
    public async getUserByEmail(email: string): Promise<User | undefined> {
        const lowerEmail = email.toLowerCase();

        return this.entityManager.createQueryBuilder(User, 'user').select().where('lower(email) = :lowerEmail', { lowerEmail }).getOne();
    }

    /**
     * creates a new user
     * throws a creation exception if a user with the same email already exist
     * @param email user to insert
     */
    public async insertUser(user: User): Promise<User | undefined> {
        try {
            return await this.entityManager.save(user);
        } catch (error) {
            if (error.code === dbExceptionCodes.DUPLICATE_KEY) {
                throw new CreationException(CreationExceptionCodes.UNABLE_TO_CREATE_USER, 'unable to create user', error.detail, {
                    email: user.email,
                });
            }
        }
    }
}
