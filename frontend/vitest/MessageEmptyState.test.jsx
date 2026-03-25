import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MessageEmptyState from '../src/components/MessageEmptyState.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('MessageEmptyState.jsx', () => {
  it('renders empty state text', () => {
    render(<MessageEmptyState page={page} />);
    expect(screen.getByText(/beszel|getes|beszélgetés/i)).toBeInTheDocument();
  });
});
