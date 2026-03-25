import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ItemImageAndUser from '../src/components/ItemImageAndUser.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('ItemImageAndUser.jsx', () => {
  it('calls vote handlers', async () => {
    const user = userEvent.setup();
    const onUpVote = vi.fn();
    const onDownVote = vi.fn();

    render(
      <ItemImageAndUser
        page={page}
        ad={{ files: 'x.png', item_name: 'Amp' }}
        userData={{ profile_picture: 'u.png', username: 'sam', up_votes: 1, down_votes: 2 }}
        isMyAd={false}
        isLoggedIn={true}
        voteLoading={false}
        onUpVote={onUpVote}
        onDownVote={onDownVote}
      />,
    );

    const voteButtons = screen.getAllByRole('button');
    await user.click(voteButtons[0]);
    await user.click(voteButtons[1]);
    expect(onUpVote).toHaveBeenCalled();
    expect(onDownVote).toHaveBeenCalled();
  });
});
