import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AdFormHeader from '../src/components/AdFormHeader.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('AdFormHeader.jsx', () => {
  it('renders heading for both create and edit page variants', () => {
    const { rerender } = render(<AdFormHeader page={page} title='T' />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    const editPage = { ...page };
    delete editPage.newAdTextContainer;
    rerender(<AdFormHeader page={editPage} title='E' />);
    expect(screen.getByText('E')).toBeInTheDocument();
  });
});
