export default function ConversationsList({ page, conversations, profiles, selectedConversation, loading, onSelectConversation, formatDate, getInitials }) {
  return (
    <div className={page.conversationsSidebar}>
      <div className={page.sidebarHeader}></div>

      <div className={page.conversationsList}>
        {loading ? (
          <div className={page.emptyConversations}>Betöltés...</div>
        ) : conversations.length === 0 ? (
          <div className={page.emptyConversations}>
            Nincsenek üzenetek
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherUser = profiles[conversation.userId];
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            return (
              <div
                key={conversation.userId}
                className={
                  selectedConversation?.userId === conversation.userId
                    ? page.conversationItemActive
                    : page.conversationItem
                }
                onClick={() => onSelectConversation(conversation)}
              >
                {otherUser?.profile_picture ? (
                  <img
                    src={otherUser.profile_picture}
                    alt=""
                    className={page.userAvatar}
                  />
                ) : (
                  <div className={page.userAvatar}>
                    {getInitials(otherUser?.username || "?")}
                  </div>
                )}
                <div className={page.conversationInfo}>
                  <div className={page.conversationName}>
                    {otherUser?.username || "Ismeretlen"}
                  </div>
                  <div className={page.conversationPreview}>
                    {lastMessage?.content?.slice(0, 50)}
                    {lastMessage?.content?.length > 50 ? "..." : ""}
                  </div>
                </div>
                <div className={page.conversationDate}>
                  {formatDate(lastMessage?.sent_at)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
