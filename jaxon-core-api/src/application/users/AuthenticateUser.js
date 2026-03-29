import { UnauthorizedException } from '../../domain/core/exceptions.js';
export class AuthenticateUser {
    userRepository;
    passwordHasher;
    tokenService;
    constructor(userRepository, passwordHasher, tokenService) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
    }
    async execute(request) {
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
//# sourceMappingURL=AuthenticateUser.js.map