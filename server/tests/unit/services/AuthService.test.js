/**
 * AuthService Unit Tests
 * 
 * Tests for user registration, login, and token management.
 * These are critical security functions per the Security Profile.
 */

// Reset modules before each test to get fresh instances
beforeEach(() => {
    jest.resetModules();
});

describe('AuthService', () => {
    let AuthService;
    let mockDb;
    let mockBcrypt;
    let mockJwt;
    let mockUserRepository;
    let mockTransaction;

    beforeEach(() => {
        // Create mock transaction
        mockTransaction = {
            commit: jest.fn().mockResolvedValue(undefined),
            rollback: jest.fn().mockResolvedValue(undefined),
        };

        // Mock database
        mockDb = {
            sequelize: {
                transaction: jest.fn().mockResolvedValue(mockTransaction),
            },
            User: {
                create: jest.fn(),
            },
            Profile: {
                create: jest.fn(),
            },
            Student: {
                create: jest.fn(),
            },
            Professor: {
                create: jest.fn(),
            },
        };

        // Mock bcrypt
        mockBcrypt = {
            hash: jest.fn().mockResolvedValue('hashed_password'),
            compare: jest.fn(),
        };

        // Mock jwt
        mockJwt = {
            sign: jest.fn().mockReturnValue('mock_token'),
            verify: jest.fn(),
        };

        // Mock UserRepository
        mockUserRepository = {
            findByEmail: jest.fn(),
            findByIdWithRelations: jest.fn(),
        };

        // Set up module mocks
        jest.doMock('bcrypt', () => mockBcrypt);
        jest.doMock('jsonwebtoken', () => mockJwt);
        jest.doMock('../../../src/models', () => mockDb);
        jest.doMock('../../../src/repositories/UserRepository', () => mockUserRepository);
        jest.doMock('../../../src/repositories/ProfileRepository', () => ({}));
        jest.doMock('../../../src/repositories/StudentRepository', () => ({}));
        jest.doMock('../../../src/repositories/ProfessorRepository', () => ({}));
        jest.doMock('../../../src/config', () => ({
            jwtSecret: 'test-secret',
            jwtExpiresIn: '1h',
        }));

        // Import AuthService after mocks are set up
        AuthService = require('../../../src/services/AuthService');
    });

    describe('register', () => {
        it('should register a new student successfully', async () => {
            const userData = {
                fullName: 'Test Student',
                email: 'student@test.com',
                password: 'password123',
                role: 'STUDENT',
            };

            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockDb.User.create.mockResolvedValue({ id: 1 });
            mockDb.Profile.create.mockResolvedValue({});
            mockDb.Student.create.mockResolvedValue({});
            mockUserRepository.findByIdWithRelations.mockResolvedValue({
                id: 1,
                email: userData.email,
                role: 'STUDENT',
            });

            const result = await AuthService.register(
                userData.fullName,
                userData.email,
                userData.password,
                userData.role
            );

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
            expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(mockTransaction.commit).toHaveBeenCalled();
        });

        it('should throw error if user already exists', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({ id: 1, email: 'exists@test.com' });

            await expect(
                AuthService.register('Test', 'exists@test.com', 'password', 'STUDENT')
            ).rejects.toThrow('User with this email already exists');
        });

        it('should throw error for invalid role', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(
                AuthService.register('Test', 'test@test.com', 'password', 'ADMIN')
            ).rejects.toThrow('Invalid role');
        });

        it('should register a professor and create professor record', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockDb.User.create.mockResolvedValue({ id: 2 });
            mockDb.Profile.create.mockResolvedValue({});
            mockDb.Professor.create.mockResolvedValue({});
            mockUserRepository.findByIdWithRelations.mockResolvedValue({
                id: 2,
                email: 'prof@test.com',
                role: 'PROFESSOR',
            });

            const result = await AuthService.register('Prof', 'prof@test.com', 'password', 'PROFESSOR');

            expect(mockDb.Professor.create).toHaveBeenCalled();
            expect(result.user.role).toBe('PROFESSOR');
        });

        it('should rollback transaction on error', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockDb.User.create.mockRejectedValue(new Error('Database error'));

            await expect(
                AuthService.register('Test', 'test@test.com', 'password', 'STUDENT')
            ).rejects.toThrow('Database error');

            expect(mockTransaction.rollback).toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should login user with valid credentials', async () => {
            const mockUser = {
                id: 1,
                email: 'test@test.com',
                passwordHash: 'hashed_password',
                role: 'STUDENT',
            };

            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockBcrypt.compare.mockResolvedValue(true);
            mockUserRepository.findByIdWithRelations.mockResolvedValue(mockUser);

            const result = await AuthService.login('test@test.com', 'password');

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
        });

        it('should throw error for non-existent user', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(
                AuthService.login('nouser@test.com', 'password')
            ).rejects.toThrow('Invalid credentials');
        });

        it('should throw error for wrong password', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({
                id: 1,
                email: 'test@test.com',
                passwordHash: 'hashed_password',
            });
            mockBcrypt.compare.mockResolvedValue(false);

            await expect(
                AuthService.login('test@test.com', 'wrongpassword')
            ).rejects.toThrow('Invalid credentials');
        });
    });

    describe('generateToken', () => {
        it('should generate a valid JWT token', () => {
            const user = { id: 1, email: 'test@test.com', role: 'STUDENT' };

            const token = AuthService.generateToken(user);

            expect(mockJwt.sign).toHaveBeenCalledWith(
                { id: user.id, email: user.email, role: user.role },
                'test-secret',
                { expiresIn: '1h' }
            );
            expect(token).toBe('mock_token');
        });
    });

    describe('verifyToken', () => {
        it('should verify a valid token', () => {
            const decoded = { id: 1, email: 'test@test.com' };
            mockJwt.verify.mockReturnValue(decoded);

            const result = AuthService.verifyToken('valid_token');

            expect(result).toEqual(decoded);
        });

        it('should throw error for invalid token', () => {
            mockJwt.verify.mockImplementation(() => {
                throw new Error('jwt malformed');
            });

            expect(() => AuthService.verifyToken('invalid_token')).toThrow('Invalid token');
        });
    });
});
