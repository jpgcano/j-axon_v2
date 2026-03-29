import { PrismaClient } from '../../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

import { RegisterUser } from '../../application/users/RegisterUser.js';
import { AuthenticateUser } from '../../application/users/AuthenticateUser.js';
import { CreateAsset } from '../../application/assets/CreateAsset.js';
import { ListAssets } from '../../application/assets/ListAssets.js';
import { GetAsset } from '../../application/assets/GetAsset.js';
import { CreateTicket } from '../../application/tickets/CreateTicket.js';
import { ListTickets } from '../../application/tickets/ListTickets.js';
import { GetTicket } from '../../application/tickets/GetTicket.js';
import { UpdateTicketStatus } from '../../application/tickets/UpdateTicketStatus.js';
import { CreateMaintenance } from '../../application/maintenance/CreateMaintenance.js';
import { ListMaintenance } from '../../application/maintenance/ListMaintenance.js';
import { GetMaintenance } from '../../application/maintenance/GetMaintenance.js';
import { UpdateMaintenanceStatus } from '../../application/maintenance/UpdateMaintenanceStatus.js';

import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';
import { PrismaAssetRepository } from '../repositories/PrismaAssetRepository.js';
import { PrismaTicketRepository } from '../repositories/PrismaTicketRepository.js';
import { PrismaMaintenanceRepository } from '../repositories/PrismaMaintenanceRepository.js';
import { PrismaAuditLogRepository } from '../repositories/PrismaAuditLogRepository.js';
import { BcryptPasswordHasher } from '../security/BcryptPasswordHasher.js';
import { JwtTokenService } from '../security/JwtTokenService.js';
import { AuditService } from '../services/AuditService.js';
import { webSocketService } from '../sockets/WebSocketService.js';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });

export const userRepository = new PrismaUserRepository(prisma);
export const assetRepository = new PrismaAssetRepository(prisma);
export const ticketRepository = new PrismaTicketRepository(prisma);
export const maintenanceRepository = new PrismaMaintenanceRepository(prisma);
export const auditLogRepository = new PrismaAuditLogRepository(prisma);

export const passwordHasher = new BcryptPasswordHasher(12);
export const tokenService = new JwtTokenService(
  process.env.JWT_SECRET || 'dev_secret_key',
  '1h',
  '7d'
);
export const auditService = new AuditService(auditLogRepository);

export const registerUser = new RegisterUser(userRepository, passwordHasher);
export const authenticateUser = new AuthenticateUser(userRepository, passwordHasher, tokenService);

export const createAsset = new CreateAsset(assetRepository);
export const listAssets = new ListAssets(assetRepository);
export const getAsset = new GetAsset(assetRepository);

export const createTicket = new CreateTicket(ticketRepository);
export const listTickets = new ListTickets(ticketRepository);
export const getTicket = new GetTicket(ticketRepository);
export const updateTicketStatus = new UpdateTicketStatus(ticketRepository);

export const createMaintenance = new CreateMaintenance(maintenanceRepository, webSocketService, auditService);
export const listMaintenance = new ListMaintenance(maintenanceRepository);
export const getMaintenance = new GetMaintenance(maintenanceRepository);
export const updateMaintenanceStatus = new UpdateMaintenanceStatus(maintenanceRepository, webSocketService, auditService);
