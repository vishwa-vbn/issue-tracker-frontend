import { z } from 'zod';
import { ROLES } from '@/constants';

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum([ROLES.USER, ROLES.ADMIN]),
  isActive: z.boolean().default(true),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().optional().refine((val) => !val || val.length >= 8, {
    message: 'Password must be at least 8 characters if provided',
  }),
  role: z.enum([ROLES.USER, ROLES.ADMIN]),
  isActive: z.boolean(),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;

