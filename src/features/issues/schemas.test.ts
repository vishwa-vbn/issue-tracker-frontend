import { describe, it, expect } from 'vitest';
import { issueFormSchema } from './schemas';

describe('Issue Form Schema', () => {
  it('validates a complete issue form', () => {
    const valid = issueFormSchema.safeParse({
      title: 'Fix broken navigation link',
      description: 'The dashboard link redirects to 404',
      priority: 'HIGH',
      assigneeId: null,
    });
    expect(valid.success).toBe(true);
  });

  it('rejects title shorter than 3 characters', () => {
    const invalid = issueFormSchema.safeParse({
      title: 'ab',
      description: '',
      priority: 'MEDIUM',
    });
    expect(invalid.success).toBe(false);
  });

  it('rejects invalid priority value', () => {
    const invalid = issueFormSchema.safeParse({
      title: 'Fix issue',
      description: '',
      priority: 'UNKNOWN_PRIORITY',
    });
    expect(invalid.success).toBe(false);
  });
});

