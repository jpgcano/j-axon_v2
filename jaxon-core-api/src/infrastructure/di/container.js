import { PrismaClient } from '../../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';
import { BcryptPasswordHasher } from '../security/BcryptPasswordHasher.js';
import { JwtTokenService } from '../security/JwtTokenService.js';
import { RegisterUser } from '../../application/users/RegisterUser.js';
import { AuthenticateUser } from '../../application/users/AuthenticateUser.js';
import { PrismaAssetRepository } from '../repositories/PrismaAssetRepository.js';
import { CreateAsset } from '../../application/assets/CreateAsset.js';
import { ListAssets } from '../../application/assets/ListAssets.js';
import { GetAsset } from '../../application/assets/GetAsset.js';
// Initialize Prisma
const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
// Repositories
export const userRepository = new PrismaUserRepository(prisma);
export const assetRepository = new PrismaAssetRepository(prisma);
// Security Services
export const passwordHasher = new BcryptPasswordHasher(12);
export const tokenService = new JwtTokenService(process.env.JWT_SECRET || 'dev_secret_key', // TODO: Enforce strict check in production
'1h', '7d');
// Use Cases
export const registerUser = new RegisterUser(userRepository, passwordHasher);
export const authenticateUser = new AuthenticateUser(userRepository, passwordHasher, tokenService);
export const createAsset = new CreateAsset(assetRepository);
export const listAssets = new ListAssets(assetRepository);
export const getAsset = new GetAsset(assetRepository);
//# sourceMappingURL=container.js.map