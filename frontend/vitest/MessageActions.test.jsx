import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import MessageActions from '../src/components/MessageActions.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('MessageActions.jsx', () => {
  it('runs reply and delete action handlers', async () => {
    const user = userEvent.setup();
    const onOpenReply = vi.fn();
    const onDeleteConversation = vi.fn();

    render(
      <MessageActions
        page={page}
        onOpenReply={onOpenReply}
        onDeleteConversation={onDeleteConversation}
      />,
    );

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    expect(onOpenReply).toHaveBeenCalled();
    expect(onDeleteConversation).toHaveBeenCalled();
  });
});
