import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import MessageModal from '../src/components/MessageModal.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('MessageModal.jsx', () => {
  it('trims and sends message', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSend = vi.fn();

    render(
      <MessageModal
        page={page}
        showReplyModal={true}
        selectedConversation={{ userId: 2 }}
        profiles={{ 2: { username: 'bob' } }}
        onClose={onClose}
        onSend={onSend}
      />,
    );

    await user.type(screen.getByPlaceholderText(/uzen|üzen/i), ' hello ');
    await user.click(screen.getByRole('button', { name: /Kuld|Küld/i }));
    expect(onSend).toHaveBeenCalledWith('hello');
  });
});
