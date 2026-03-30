import { describe, it, expect, vi } from 'vitest';
import { RegisterUser } from '../RegisterUser.js';

describe('RegisterUser', () => {
  const mockUserRepository = {
    save: vi.fn(),
    findByEmail: vi.fn(),
  };
  const mockPasswordHasher = {
    hash: vi.fn(),
  };
  const mockAuditLogger = {
    logAction: vi.fn(),
  };

  const registerUser = new RegisterUser(mockUserRepository, mockPasswordHasher, mockAuditLogger as any);

  it('should register a new user', async () => {
    const request = {
      id: 'user-1',
      email: 'test@example.com',
      passwordPlain: 'password123',
      role: 'TECH',
      systemIp: '127.0.0.1',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue('hashedPassword');
    mockUserRepository.save.mockResolvedValue(undefined);

    await registerUser.execute(request);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('password123');
    expect(mockUserRepository.save).toHaveBeenCalled();
    const savedUser = mockUserRepository.save.mock.calls[0][0];
    expect(savedUser.email).toBe('test@example.com');
  });

  it('should throw error if user already exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({ email: 'test@example.com' });

    await expect(
      registerUser.execute({
        id: 'user-2',
        email: 'test@example.com',
        passwordPlain: 'pass',
        role: 'TECH',
        systemIp: '127.0.0.1',
      })
    ).rejects.toThrow('User with email test@example.com already exists');
  });
});
