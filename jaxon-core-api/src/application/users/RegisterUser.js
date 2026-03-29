import { User, UserRole } from '../../domain/users/User.js';
import { InvalidArgumentException } from '../../domain/core/exceptions.js';
export class RegisterUser {
    userRepository;
    passwordHasher;
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }
    async execute(request) {
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new InvalidArgumentException(`User with email ${request.email} already exists`);
        }
        const passwordHash = await this.passwordHasher.hash(request.passwordPlain);
        const now = new Date();
        const userProps = {
            id: request.id,
            email: request.email,
            passwordHash: passwordHash,
            role: request.role,
            isActive: true,
            createdBy: request.id, // Self-registered
            updatedBy: request.id,
            createdAt: now,
            updatedAt: now,
        };
        const user = new User(userProps);
        await this.userRepository.save(user);
        // Note: The actual persistence implementation (PrismaRepository) will 
        // handle the integrity_hash and audit columns during the save() operation.
    }
}
//# sourceMappingURL=RegisterUser.js.map