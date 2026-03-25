import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AdFormFields from '../src/components/AdFormFields.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('AdFormFields.jsx', () => {
  it('calls validateInputs through field handlers', async () => {
    const user = userEvent.setup();
    const validateInputs = vi.fn();

    render(
      <AdFormFields
        page={page}
        itemNameRef={createRef()}
        categoryIdRef={createRef()}
        brandIdRef={createRef()}
        conditionRef={createRef()}
        priceRef={createRef()}
        imageRef={createRef()}
        descriptionRef={createRef()}
        categories={[{ id: 1, name: 'a' }]}
        brands={[{ id: 1, brand_name: 'b' }]}
        isEditing={false}
        isValid={{ itemName: true, price: true, imageFile: true, description: true }}
        isEdited={{ itemName: true, price: true, imageFile: true, description: true }}
        validateInputs={validateInputs}
      />,
    );

    const textInputs = screen.getAllByRole('textbox');
    await user.type(textInputs[0], 'abc');
    fireEvent.blur(textInputs[0]);
    expect(validateInputs).toHaveBeenCalled();
  });
});
