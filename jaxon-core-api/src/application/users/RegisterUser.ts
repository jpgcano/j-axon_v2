import { User, UserRole, UserProps } from '../../domain/users/User.js';
import { UserRepository } from '../../domain/users/UserRepository.js';
import { PasswordHasher } from '../../domain/users/PasswordHasher.js';
import { InvalidArgumentException } from '../../domain/core/exceptions.js';

export interface RegisterUserRequest {
  id: string; // Passed from the outside (e.g. randomUUID())
  email: string;
  passwordPlain: string;
  role: UserRole;
  systemIp: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  public async execute(request: RegisterUserRequest): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new InvalidArgumentException(`User with email ${request.email} already exists`);
    }

    const passwordHash = await this.passwordHasher.hash(request.passwordPlain);
    const now = new Date();

    const userProps: UserProps = {
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
