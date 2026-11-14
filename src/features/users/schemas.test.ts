import { describe, it, expect } from 'vitest';
import { createUserSchema, editUserSchema } from './schemas';
import { ROLES } from '@/constants';

describe('User Schemas', () => {
  describe('createUserSchema', () => {
    it('validates a correct user creation payload', () => {
      const valid = {
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        password: 'Passw0rd123',
        role: ROLES.USER,
        isActive: true,
      };
      const result = createUserSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects short passwords and invalid emails', () => {
      const invalid = {
        name: 'S',
        email: 'not-an-email',
        password: 'short',
        role: ROLES.USER,
        isActive: true,
      };
      const result = createUserSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues.map((i) => i.path[0]);
        expect(issues).toContain('name');
        expect(issues).toContain('email');
        expect(issues).toContain('password');
      }
    });
  });

  describe('editUserSchema', () => {
    it('allows editing without changing password', () => {
      const valid = {
        name: 'Sarah Connor Lead',
        email: 'sarah.lead@example.com',
        password: '',
        role: ROLES.ADMIN,
        isActive: true,
      };
      const result = editUserSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('enforces password length if a new password is provided', () => {
      const invalid = {
        name: 'Sarah Connor Lead',
        email: 'sarah.lead@example.com',
        password: '123',
        role: ROLES.ADMIN,
        isActive: true,
      };
      const result = editUserSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});

