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
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
  };

  const authenticateUser = new AuthenticateUser(mockUserRepository, mockPasswordHasher, mockTokenService);

  it('should authenticate user with correct credentials', async () => {
    const user = {
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'TECH',
    };

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(true);
    mockTokenService.generateAccessToken.mockReturnValue('accessToken');
    mockTokenService.generateRefreshToken.mockReturnValue('refreshToken');

    const result = await authenticateUser.execute({ email: 'test@example.com', password: 'password123' });

    expect(result.accessToken).toBe('accessToken');
    expect(result.refreshToken).toBe('refreshToken');
    expect(result.user.id).toBe('user-1');
  });

  it('should throw error for invalid credentials', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(authenticateUser.execute({ email: 'wrong@example.com', password: 'pass' })).rejects.toThrow('Invalid credentials');
  });
});