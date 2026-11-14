import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {
  it('renders Open status correctly', () => {
    render(<StatusBadge status="OPEN" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders In Progress status correctly', () => {
    render(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders Closed status correctly', () => {
    render(<StatusBadge status="CLOSED" />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });
});

