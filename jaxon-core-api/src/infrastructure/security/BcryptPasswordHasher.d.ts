import type { PasswordHasher } from '../../domain/users/PasswordHasher.js';
export declare class BcryptPasswordHasher implements PasswordHasher {
    private readonly saltRounds;
    constructor(saltRounds?: number);
    hash(plainText: string): Promise<string>;
    compare(plainText: string, hashed: string): Promise<boolean>;
}
//# sourceMappingURL=BcryptPasswordHasher.d.ts.map