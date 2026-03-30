import { PrismaClient } from '../../../generated/prisma/client.js';
import { User } from '../../domain/users/User.js';
import type { UserRepository } from '../../domain/users/UserRepository.js';
export declare class PrismaUserRepository implements UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private generateIntegrityHash;
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}
//# sourceMappingURL=PrismaUserRepository.d.ts.map