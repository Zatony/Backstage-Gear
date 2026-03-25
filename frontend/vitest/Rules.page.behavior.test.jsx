import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RulesPage from '../src/page_rules/rules.jsx';

describe('Rules page behavior', () => {
  it('renders heading and rule sections', () => {
    render(<RulesPage />);
    expect(screen.getByRole('heading', { name: 'Szabályok' })).toBeInTheDocument();
    expect(screen.getByText(/Tiltott tartalmak és hirdetések/i)).toBeInTheDocument();
  });
});
