import { UserRepository } from '../../domain/users/UserRepository.js';
import { PasswordHasher } from '../../domain/users/PasswordHasher.js';
import { TokenService, AuthTokens } from '../../domain/users/TokenService.js';
import { UnauthorizedException } from '../../domain/core/exceptions.js';

export interface AuthenticateUserRequest {
  email: string;
  passwordPlain: string;
}

export class AuthenticateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  public async execute(request: AuthenticateUserRequest): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(request.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const isPasswordValid = await this.passwordHasher.compare(request.passwordPlain, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.tokenService.generateToken({
      userId: user.id,
      role: user.role,
    });

    return tokens;
  }
}
