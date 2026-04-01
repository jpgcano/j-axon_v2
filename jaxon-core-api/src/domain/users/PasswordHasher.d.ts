export interface PasswordHasher {
    hash(plainText: string): Promise<string>;
    compare(plainText: string, hashed: string): Promise<boolean>;
}
//# sourceMappingURL=PasswordHasher.d.ts.map