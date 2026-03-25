import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ItemDetails from '../src/components/ItemDetails.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('ItemDetails.jsx', () => {
  it('renders ad details', () => {
    render(
      <ItemDetails
        page={page}
        ad={{ item_name: 'Amp', date_of_ad: '2025-03-22T10:00:00', item_condition: 'Used', description: 'Good' }}
      />,
    );

    expect(screen.getByText('Amp')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });
});
