import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SelectOption from '../src/components/selectOption.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('selectOption.jsx', () => {
  it('renders option label fallback', () => {
    render(
      <SelectOption
        page={page}
        label='Brand'
        options={[{ id: 1, brand_name: 'Fender' }]}
        refInput={createRef()}
      />,
    );

    expect(screen.getByText('Fender')).toBeInTheDocument();
  });
});
