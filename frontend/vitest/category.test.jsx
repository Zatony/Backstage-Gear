import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Category from '../src/components/category.jsx';
import { page, setupCommonBeforeEach, testState } from './testUtils.jsx';

setupCommonBeforeEach();

describe('category.jsx', () => {
  it('navigates on category click', async () => {
    const user = userEvent.setup();
    render(
      <Category
        page={page}
        isLoading={false}
        loadingText='loading'
        fallbackText='none'
        categories={[{ id: 1, name: 'guitar', picture: 'p.png' }]}
      />,
    );

    await user.click(screen.getByText('Guitar'));
    expect(testState.navigate).toHaveBeenCalled();
  });
});
