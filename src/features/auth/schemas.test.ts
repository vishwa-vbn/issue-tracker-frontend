import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from './schemas';

describe('Auth Schemas', () => {
  it('validates correct login credentials', () => {
    const valid = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(valid.success).toBe(true);
  });

  it('rejects invalid email addresses in login', () => {
    const invalid = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(invalid.success).toBe(false);
  });

  it('validates proper register inputs', () => {
    const valid = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Passw0rd123',
    });
    expect(valid.success).toBe(true);
  });

  it('rejects short passwords in register', () => {
    const invalid = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'short',
    });
    expect(invalid.success).toBe(false);
  });
});

