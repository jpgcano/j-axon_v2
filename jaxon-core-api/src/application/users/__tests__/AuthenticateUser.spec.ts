import { describe, it, expect, vi } from 'vitest';
import { AuthenticateUser } from '../AuthenticateUser.js';

describe('AuthenticateUser', () => {
  const mockUserRepository = {
    findByEmail: vi.fn(),
  };
  const mockPasswordHasher = {
    compare: vi.fn(),
  };
  const mockTokenService = {
    generateToken: vi.fn(),
    verifyToken: vi.fn(),
  };

  const authenticateUser = new AuthenticateUser(mockUserRepository, mockPasswordHasher, mockTokenService);

  it('should authenticate user with correct credentials', async () => {
    const user = {
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashedPassword',
      role: 'TECH',
      isActive: true,
    };

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(true);
    mockTokenService.generateToken.mockResolvedValue({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    });

    const result = await authenticateUser.execute({ email: 'test@example.com', passwordPlain: 'password123' });

    expect(result.accessToken).toBe('accessToken');
    expect(result.refreshToken).toBe('refreshToken');
  });

  it('should throw error for invalid credentials', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(authenticateUser.execute({ email: 'wrong@example.com', passwordPlain: 'pass' })).rejects.toThrow('Invalid credentials');
  });
});
