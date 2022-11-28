import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string, salt?: string) {
        salt = salt ?? randomBytes(8).toString('hex');
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buffer.toString()}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const salt = storedPassword.split('.')[1];
        
        return storedPassword ===  await this.toHash(suppliedPassword, salt);
    }
}