import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AdFormActions from '../src/components/AdFormActions.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('AdFormActions.jsx', () => {
  it('renders submit and error state', () => {
    render(<AdFormActions page={page} submitting={true} error='x' buttonText='Save' />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('x')).toBeInTheDocument();
  });
});
