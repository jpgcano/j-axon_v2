import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ActivateUser } from '../ActivateUser.js';
import { User, UserRole } from '../../../domain/users/User.js';
import { NotFoundException, InvalidArgumentException } from '../../../domain/core/exceptions.js';

describe('ActivateUser', () => {
  const userRepository = {
    findById: vi.fn(),
    save: vi.fn(),
  } as any;

  const auditLogger = {
    logAction: vi.fn(),
  } as any;

  let useCase: ActivateUser;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ActivateUser(userRepository, auditLogger);
  });

  it('should activate user and audit', async () => {
    const user = new User({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hash',
      role: UserRole.TECH,
      isActive: false,
      createdBy: 'admin',
      updatedBy: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    userRepository.findById.mockResolvedValue(user);

    await useCase.execute({ id: 'user-1', actorId: 'admin', userRole: 'ADMIN' });

    expect(userRepository.save).toHaveBeenCalled();
    expect(auditLogger.logAction).toHaveBeenCalled();
  });

  it('should throw if role not allowed', async () => {
    await expect(
      useCase.execute({ id: 'user-1', actorId: 'tech', userRole: 'TECH' })
    ).rejects.toBeInstanceOf(InvalidArgumentException);
  });

  it('should throw if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'missing', actorId: 'admin', userRole: 'ADMIN' })
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
