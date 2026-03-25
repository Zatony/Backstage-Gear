import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from '../src/components/footer.jsx';
import { setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('footer.jsx', () => {
  it('renders static footer text', () => {
    render(<Footer />);
    expect(screen.getByText(/Backstage Gear/i)).toBeInTheDocument();
  });
});
