import { useEffect, useRef } from "react";

export default function ChatMessages({ page, selectedConversation, formatDate }) {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation]);

  return (
    <div className={page.chatArea}>
      {selectedConversation.messages.map((message) => (
        <div
          key={message.id}
          className={
            message.isFromCurrentUser
              ? page.messageBubbleRight
              : page.messageBubbleLeft
          }
        >
          <div className={page.messageBubbleContent}>
            {message.content}
          </div>
          <div className={page.messageBubbleTime}>
            {formatDate(message.sent_at)}
          </div>
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
}
