import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ChatMessages from '../src/components/ChatMessages.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('ChatMessages.jsx', () => {
  it('renders message bubbles', () => {
    const selectedConversation = {
      userId: 2,
      messages: [
        { id: 1, content: 'from me', sent_at: '2025-01-01', isFromCurrentUser: true },
        { id: 2, content: 'from them', sent_at: '2025-01-02', isFromCurrentUser: false },
      ],
    };

    render(
      <ChatMessages
        page={page}
        selectedConversation={selectedConversation}
        formatDate={(d) => `d:${d}`}
      />,
    );

    expect(screen.getByText('from me')).toBeInTheDocument();
    expect(screen.getByText('from them')).toBeInTheDocument();
  });
});
