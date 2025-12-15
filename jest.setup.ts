import '@testing-library/jest-dom';

// Mock environment variables for tests
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEXTAUTH_SECRET = 'test-secret-at-least-32-characters-long';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
