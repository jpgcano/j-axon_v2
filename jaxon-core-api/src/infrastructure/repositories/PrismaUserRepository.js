import { PrismaClient } from '../../../generated/prisma/client.js';
import { createHash } from 'crypto';
import { User, UserRole } from '../../domain/users/User.js';
export class PrismaUserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateIntegrityHash(id, email, date) {
        const data = `${id}|${email}|${date.toISOString()}`;
        return createHash('sha256').update(data).digest('hex');
    }
    async save(user) {
        const props = user.toPrimitives();
        // In a real application, ipOrigin would come from a Request Context (AsyncLocalStorage)
        // Using a system default for now to satisfy the DB constraint
        const systemIp = '127.0.0.1';
        const integrityHash = this.generateIntegrityHash(props.id, props.email, props.updatedAt);
        await this.prisma.jaxonUser.upsert({
            where: { id: props.id },
            update: {
                email: props.email,
                password_hash: props.passwordHash,
                role_name: props.role,
                is_active: props.isActive,
                updated_by: props.updatedBy,
                updated_at: props.updatedAt,
                ip_origin: systemIp,
                integrity_hash: integrityHash,
            },
            create: {
                id: props.id,
                email: props.email,
                password_hash: props.passwordHash,
                role_name: props.role,
                is_active: props.isActive,
                created_by: props.createdBy,
                updated_by: props.updatedBy,
                created_at: props.createdAt,
                updated_at: props.updatedAt,
                ip_origin: systemIp,
                integrity_hash: integrityHash,
            },
        });
    }
    async findById(id) {
        const data = await this.prisma.jaxonUser.findUnique({
            where: { id },
        });
        if (!data)
            return null;
        return new User({
            id: data.id,
            email: data.email,
            passwordHash: data.password_hash,
            role: data.role_name,
            isActive: data.is_active,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        });
    }
    async findByEmail(email) {
        const data = await this.prisma.jaxonUser.findUnique({
            where: { email },
        });
        if (!data)
            return null;
        return new User({
            id: data.id,
            email: data.email,
            passwordHash: data.password_hash,
            role: data.role_name,
            isActive: data.is_active,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        });
    }
}
//# sourceMappingURL=PrismaUserRepository.js.map