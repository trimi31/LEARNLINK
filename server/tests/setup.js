/**
 * Jest Test Setup
 * 
 * This file runs before each test file.
 * It sets up mocks and test utilities.
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.JWT_EXPIRES_IN = '1h';

// Mock console.error to keep test output clean (optional)
const originalConsoleError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        // Filter out expected error logs during tests
        if (args[0]?.includes?.('Error:')) return;
        originalConsoleError.apply(console, args);
    };
});

afterAll(() => {
    console.error = originalConsoleError;
});

// Global test utilities
global.testUtils = {
    generateTestUser: (overrides = {}) => ({
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'STUDENT',
        ...overrides,
    }),

    generateTestCourse: (overrides = {}) => ({
        tittle: 'Test Course',
        description: 'A test course for unit testing',
        price: 99.99,
        level: 'BEGINNER',
        category: 'Programming',
        published: true,
        ...overrides,
    }),
};
