import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ConversationsList from '../src/components/ConversationsList.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('ConversationsList.jsx', () => {
  it('calls onSelectConversation when clicking conversation', async () => {
    const user = userEvent.setup();
    const selectedConversation = { userId: 2, messages: [] };
    const onSelectConversation = vi.fn();

    render(
      <ConversationsList
        page={page}
        conversations={[selectedConversation]}
        profiles={{ 2: { username: 'bob' } }}
        selectedConversation={selectedConversation}
        loading={false}
        onSelectConversation={onSelectConversation}
        formatDate={() => 'now'}
        getInitials={(name) => name.slice(0, 1)}
      />,
    );

    await user.click(screen.getByText('bob'));
    expect(onSelectConversation).toHaveBeenCalled();
  });
});
