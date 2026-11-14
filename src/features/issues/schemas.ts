import { z } from 'zod';

export const issueFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z
    .string()
    .trim()
    .max(5000, 'Description cannot exceed 5000 characters')
    .default(''),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  assigneeId: z.string().nullable().optional(),
});

export type IssueFormValues = z.infer<typeof issueFormSchema>;

