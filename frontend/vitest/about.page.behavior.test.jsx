import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutPage from '../src/page_about/about.jsx';

describe('About page behavior', () => {
  it('renders core intro text', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: 'Rólunk' })).toBeInTheDocument();
    expect(screen.getByText(/Backstage Gear egy 2025-ben alapított/i)).toBeInTheDocument();
  });
});
