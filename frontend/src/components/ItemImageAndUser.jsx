export default function ItemImageAndUser({
  page,
  ad,
  userData,
  isMyAd,
  isLoggedIn,
  voteLoading,
  onUpVote,
  onDownVote,
}) {
  const disableVoteButtons = voteLoading || isMyAd || !isLoggedIn;

  return (
    <div className={page.adImageAndUser}>
      <img
        src={ad.files}
        alt={ad.item_name}
        className={page.mainImg}
      />
      <div className={page.adHeaderMobile}>
        <h2 className={page.adTitle}>{ad.item_name}</h2>
        <div className={page.adMeta}>
          {ad.date_of_ad !== undefined && ad.date_of_ad !== null
            ? ad.date_of_ad.substring(0, 16)
            : "-"}
        </div>
      </div>
      <div className={page.userRow}>
        <img
          className={page.userIcon}
          src={userData.profile_picture}
          alt={userData.username}
        />
        <span className={page.username}>{userData.username}</span>
      </div>
      <div className={page.ratingRow}>
        <span
          className={page.rating}
        >{`Értékelés: +${userData.up_votes} | -${userData.down_votes}`}</span>
      </div>
      <div className={page.voteActions}>
        <button
          type="button"
          className={page.voteUpButton}
          onClick={onUpVote}
          disabled={disableVoteButtons}
        >
          +
        </button>
        <button
          type="button"
          className={page.voteDownButton}
          onClick={onDownVote}
          disabled={disableVoteButtons}
        >
          -
        </button>
      </div>
    </div>
  );
}
