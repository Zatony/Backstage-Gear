export default function ConversationHeader({ page, selectedConversation, profiles, getInitials }) {
  return (
    <div className={page.messageDetailHeader}>
      {profiles[selectedConversation?.userId]?.profile_picture ? (
        <img
          src={profiles[selectedConversation.userId].profile_picture}
          alt=""
          className={page.detailAvatar}
        />
      ) : (
        <div className={page.detailAvatar}>
          {getInitials(profiles[selectedConversation?.userId]?.username || "?")}
        </div>
      )}
      <div className={page.detailUserInfo}>
        <div className={page.detailUserName}>
          {profiles[selectedConversation?.userId]?.username || "Ismeretlen"}
        </div>
      </div>
    </div>
  );
}
