import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ConversationHeader from '../src/components/ConversationHeader.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('ConversationHeader.jsx', () => {
  it('renders selected profile header', () => {
    const selectedConversation = { userId: 2, messages: [] };

    render(
      <ConversationHeader
        page={page}
        selectedConversation={selectedConversation}
        profiles={{ 2: { username: 'bob' } }}
        getInitials={(name) => name.slice(0, 1)}
      />,
    );

    expect(screen.getByText('bob')).toBeInTheDocument();
  });
});
