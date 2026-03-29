import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';
import { BcryptPasswordHasher } from '../security/BcryptPasswordHasher.js';
import { JwtTokenService } from '../security/JwtTokenService.js';
import { RegisterUser } from '../../application/users/RegisterUser.js';
import { AuthenticateUser } from '../../application/users/AuthenticateUser.js';
export declare const prisma: import("../../../generated/prisma/internal/class.js").PrismaClient<never, import("../../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined, import("@prisma/client/runtime/client").DefaultArgs>;
export declare const userRepository: PrismaUserRepository;
export declare const passwordHasher: BcryptPasswordHasher;
export declare const tokenService: JwtTokenService;
export declare const registerUser: RegisterUser;
export declare const authenticateUser: AuthenticateUser;
//# sourceMappingURL=container.d.ts.map