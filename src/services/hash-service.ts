import { compare, hash } from 'bcryptjs';

export abstract class HashService {
    public static async compare(text: string, hashToCompare: string): Promise<boolean> {
        return HashService.compareUsingBcrypt(text, hashToCompare);
    }

    public static async generate(plainText: string): Promise<string> {
        return HashService.generateHashUsingBcrypt(plainText);
    }

    private static async compareUsingBcrypt(text: string, hashToCompare: string): Promise<boolean> {
        return compare(text, hashToCompare);
    }

    private static async generateHashUsingBcrypt(toHash: string): Promise<string> {
        return hash(toHash, HashService.getRandomSaltRounds());
    }

    private static getRandomSaltRounds(): number {
        const MAX_SALT_ROUNDS = 8;

        return Math.floor(Math.random() * Math.floor(MAX_SALT_ROUNDS));
    }
}
