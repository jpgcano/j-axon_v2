import bcrypt from 'bcrypt';
export class BcryptPasswordHasher {
    saltRounds;
    constructor(saltRounds = 12) {
        this.saltRounds = saltRounds;
    }
    async hash(plainText) {
        return await bcrypt.hash(plainText, this.saltRounds);
    }
    async compare(plainText, hashed) {
        return await bcrypt.compare(plainText, hashed);
    }
}
//# sourceMappingURL=BcryptPasswordHasher.js.map