import { Check, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { HashService } from '../../services/hash-service';
import { BaseDatabaseModelModel } from './base-db-model';

@Entity('users')
@Unique(['email'])
@Check(`"email" <> ''`)
@Check(`"password" <> ''`)
export class User extends BaseDatabaseModelModel {
    @Column()
    email: string;

    @Column()
    password: string;

    @PrimaryGeneratedColumn()
    userId: number;

    private constructor() {
        super();
    }

    /**
     * We use this function to make sure that a user is created with hashed password and lowercase email only
     * We don't use the contracture because the hash method is async
     * @param email user email
     * @param password user password
     */
    public static async getNewUser(email: string, password: string): Promise<User> {
        const user = new User();

        await user.setPassword(password);
        user.setEmail(email);

        return user;
    }

    /**
     * set lowercase email to user
     * @param email user email
     */
    public setEmail(email: string): void {
        this.email = email.toLowerCase();
    }

    /**
     * set hashed password to user
     * @param password user password
     */
    public async setPassword(password: string): Promise<void> {
        const hashedPassword = await HashService.generate(password);

        this.password = hashedPassword;
    }
}
