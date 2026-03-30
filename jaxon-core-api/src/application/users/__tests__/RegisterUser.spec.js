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
    const registerUser = new RegisterUser(mockUserRepository, mockPasswordHasher);
    it('should register a new user', async () => {
        const user = {
            email: 'test@example.com',
            password: 'password123',
            role: 'TECH',
        };
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockPasswordHasher.hash.mockResolvedValue('hashedPassword');
        mockUserRepository.save.mockResolvedValue({ id: 'user-1', ...user, password: 'hashedPassword' });
        const result = await registerUser.execute(user);
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(mockPasswordHasher.hash).toHaveBeenCalledWith('password123');
        expect(mockUserRepository.save).toHaveBeenCalled();
        expect(result.email).toBe('test@example.com');
    });
    it('should throw error if user already exists', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({ email: 'test@example.com' });
        await expect(registerUser.execute({ email: 'test@example.com', password: 'pass', role: 'TECH' })).rejects.toThrow('User already exists');
    });
});
//# sourceMappingURL=RegisterUser.spec.js.map