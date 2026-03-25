import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import InputField from '../src/components/inputField.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('inputField.jsx', () => {
  it('handles text and textarea input paths', async () => {
    const user = userEvent.setup();
    const validateInputs = vi.fn();

    render(
      <InputField
        type='text'
        name='email'
        labelText='Email'
        refData={createRef()}
        isValid={{ email: true }}
        isEdited={{ email: true }}
        validateInputs={validateInputs}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'a');
    fireEvent.blur(input);
    expect(validateInputs).toHaveBeenCalled();

    render(
      <InputField
        page={page}
        type='textarea'
        label='Desc'
        refInput={createRef()}
        fieldName='description'
      />,
    );

    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(1);
  });
});
