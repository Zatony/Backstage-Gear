export default function ItemImage({ page, ad, userData }) {
  return (
    <div className={page.adImageAndUser}>
      <img
        src={ad.files}
        alt={ad.item_name}
        className={page.mainImg}
      />
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
    </div>
  );
}
