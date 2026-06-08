// Minimal test setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_at_least_32_chars_long_for_safety';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
jest.setTimeout(20000);
