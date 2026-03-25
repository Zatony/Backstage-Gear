import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/components/ConversationsList.jsx', () => ({
  default: ({ conversations, onSelectConversation, loading }) => (
    <div>
      <div>Conversations:{loading ? 'loading' : conversations.length}</div>
      {conversations[0] && (
        <button onClick={() => onSelectConversation(conversations[0])}>SelectConversation</button>
      )}
    </div>
  ),
}));

vi.mock('../src/components/ConversationHeader.jsx', () => ({
  default: () => <div>ConversationHeader</div>,
}));

vi.mock('../src/components/ChatMessages.jsx', () => ({
  default: ({ selectedConversation }) => <div>Messages:{selectedConversation?.messages?.length || 0}</div>,
}));

vi.mock('../src/components/MessageActions.jsx', () => ({
  default: ({ onOpenReply, onDeleteConversation }) => (
    <div>
      <button onClick={onOpenReply}>OpenReply</button>
      <button onClick={onDeleteConversation}>DeleteConversation</button>
    </div>
  ),
}));

vi.mock('../src/components/MessageModal.jsx', () => ({
  default: ({ showReplyModal, onSend, onClose }) =>
    showReplyModal ? (
      <div>
        <button onClick={() => onSend('hello')}>SendReply</button>
        <button onClick={onClose}>CloseReply</button>
      </div>
    ) : null,
}));

vi.mock('../src/components/MessageEmptyState.jsx', () => ({
  default: () => <div>NoConversation</div>,
}));

import MessagePage from '../src/page_message/Message.jsx';

setupCommonBeforeEach();

describe('page_message/Message.jsx', () => {
  it('resets state and shows empty branch when user is not logged in', async () => {
    testState.token = null;
    render(<MessagePage />);
    await waitFor(() => expect(screen.getByText('Conversations:0')).toBeInTheDocument());
    expect(screen.getByText('NoConversation')).toBeInTheDocument();
  });

  it('loads conversations, sends reply and deletes conversation', async () => {
    const user = userEvent.setup();
    testState.token = 'token';
    testState.authUserId = 99;
    testState.locationState = { recipientId: 5, recipientName: 'Alice', adTitle: 'Bass' };
    window.confirm = vi.fn(() => true);

    global.fetch = vi.fn((input, init) => {
      const url = String(input);
      if (url.includes('/incoming_messages')) {
        if (init?.method === 'DELETE') return Promise.resolve({ ok: true, json: async () => ({}) });
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: 1, sender_id: 5, content: 'Hi', sent_at: '2025-01-01T10:00:00' }],
        });
      }
      if (url.includes('/sent_messages')) {
        if (init?.method === 'DELETE') return Promise.resolve({ ok: true, json: async () => ({}) });
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: 2, receiver_id: 5, content: 'Hey', sent_at: '2025-01-01T11:00:00' }],
        });
      }
      if (url.includes('/profiles/5')) {
        return Promise.resolve({ ok: true, json: async () => ({ username: 'Alice' }) });
      }
      if (url.includes('/new_message/5')) {
        return Promise.resolve({ ok: true, json: async () => ({}) });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<MessagePage />);
    await waitFor(() => expect(screen.getByText('Conversations:1')).toBeInTheDocument());

    await user.click(screen.getByText('SelectConversation'));
    expect(screen.getByText('ConversationHeader')).toBeInTheDocument();

    await user.click(screen.getByText('SendReply'));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/new_message/5'),
        expect.objectContaining({ method: 'POST' }),
      ),
    );

    await user.click(screen.getByText('DeleteConversation'));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/incoming_messages/1'),
        expect.objectContaining({ method: 'DELETE' }),
      ),
    );
  });

  it('handles message fetch failures gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    testState.token = 'token';
    global.fetch = vi.fn(() => Promise.reject(new Error('failed')));

    render(<MessagePage />);
    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    errorSpy.mockRestore();
  });
});
