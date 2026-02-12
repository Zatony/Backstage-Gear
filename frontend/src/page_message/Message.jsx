import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./message.module.css";

const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch {
    return null;
  }
};

export default function Message() {
  const location = useLocation();
  const currentUserId = getCurrentUserId();
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [newMessageRecipient, setNewMessageRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const replyTextRef = useRef(null);
  const messageEndRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (location.state?.recipientId) {
      setNewMessageRecipient({
        id: location.state.recipientId,
        name: location.state.recipientName || "Felhasználó",
        adTitle: location.state.adTitle || ""
      });
      setShowReplyModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation && conversations.length > 0) {
      const updatedConversation = conversations.find(
        (conv) => conv.userId === selectedConversation.userId
      );
      if (updatedConversation) {
        setSelectedConversation(updatedConversation);
      }
    }
  }, [conversations]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const [incomingRes, sentRes] = await Promise.all([
        fetch("http://localhost:3000/backstagegear/me/incoming_messages", {
          headers: { "x-access-token": token },
        }),
        fetch("http://localhost:3000/backstagegear/me/sent_messages", {
          headers: { "x-access-token": token },
        }),
      ]);

      let incomingData = [];
      let sentData = [];

      if (incomingRes.ok) {
        incomingData = await incomingRes.json();
        setIncomingMessages(incomingData);
      }

      if (sentRes.ok) {
        sentData = await sentRes.json();
        setSentMessages(sentData);
      }

      const userIds = new Set();
      const conversationMap = {};

      incomingData.forEach((m) => {
        userIds.add(m.sender_id);
        if (!conversationMap[m.sender_id]) {
          conversationMap[m.sender_id] = { userId: m.sender_id, messages: [] };
        }
        conversationMap[m.sender_id].messages.push({
          ...m,
          isFromCurrentUser: false
        });
      });

      sentData.forEach((m) => {
        userIds.add(m.receiver_id);
        if (!conversationMap[m.receiver_id]) {
          conversationMap[m.receiver_id] = { userId: m.receiver_id, messages: [] };
        }
        conversationMap[m.receiver_id].messages.push({
          ...m,
          isFromCurrentUser: true,
          sender_id: currentUserId
        });
      });

      Object.values(conversationMap).forEach(conv => {
        conv.messages.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
      });

      const convArray = Object.values(conversationMap).sort((a, b) => {
        const aDate = new Date(a.messages[a.messages.length - 1]?.sent_at || 0);
        const bDate = new Date(b.messages[b.messages.length - 1]?.sent_at || 0);
        return bDate - aDate;
      });

      setConversations(convArray);

      const profilesMap = {};
      await Promise.all(
        [...userIds].map(async (userId) => {
          try {
            const profileRes = await fetch(
              `http://localhost:3000/backstagegear/profiles/${userId}`,
              { headers: { "x-access-token": token } }
            );
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              profilesMap[userId] = profileData;
            }
          } catch (err) {
            console.error(`Failed to fetch profile for user ${userId}:`, err);
          }
        })
      );
      setProfiles(profilesMap);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendReply = async () => {
    if (!replyTextRef.current?.value.trim()) return;

    const recipientId = newMessageRecipient?.id || selectedConversation?.userId;
    if (!recipientId) return;

    const messageText = replyTextRef.current.value.trim();

    try {
      const res = await fetch(
        `http://localhost:3000/backstagegear/me/new_message/${recipientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({ content: messageText }),
        }
      );

      if (res.ok) {
        setShowReplyModal(false);
        setNewMessageRecipient(null);
        replyTextRef.current.value = "";
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;

    if (!window.confirm("Biztosan törlöd ezt a beszélgetést?")) return;

    try {
      await Promise.all(
        selectedConversation.messages.map(async (message) => {
          const endpoint = message.isFromCurrentUser
            ? `http://localhost:3000/backstagegear/me/sent_messages/${message.id}`
            : `http://localhost:3000/backstagegear/me/incoming_messages/${message.id}`;

          return fetch(endpoint, {
            method: "DELETE",
            headers: { "x-access-token": token },
          });
        })
      );

      setSelectedConversation(null);
      fetchMessages();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className={styles.messageTextContainer}>
        <h1 className={styles.messageTitle}>Üzenetek</h1>
        <div className={styles.messageLine}></div>
      </div>

      <div className={styles.messageContainer}>
        <div className={styles.conversationsSidebar}>
          <div className={styles.sidebarHeader}>Üzeneteim</div>

          <div className={styles.conversationsList}>
            {loading ? (
              <div className={styles.emptyConversations}>Betöltés...</div>
            ) : conversations.length === 0 ? (
              <div className={styles.emptyConversations}>
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
                        ? styles.conversationItemActive
                        : styles.conversationItem
                    }
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    {otherUser?.profile_picture ? (
                      <img
                        src={otherUser.profile_picture}
                        alt=""
                        className={styles.userAvatar}
                      />
                    ) : (
                      <div className={styles.userAvatar}>
                        {getInitials(otherUser?.username || "?")}
                      </div>
                    )}
                    <div className={styles.conversationInfo}>
                      <div className={styles.conversationName}>
                        {otherUser?.username || "Ismeretlen"}
                      </div>
                      <div className={styles.conversationPreview}>
                        {lastMessage?.content?.slice(0, 50)}
                        {lastMessage?.content?.length > 50 ? "..." : ""}
                      </div>
                    </div>
                    <div className={styles.conversationDate}>
                      {formatDate(lastMessage?.sent_at)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.messageDetail}>
          {selectedConversation ? (
            <>
              <div className={styles.messageDetailHeader}>
                {profiles[selectedConversation.userId]?.profile_picture ? (
                  <img
                    src={profiles[selectedConversation.userId].profile_picture}
                    alt=""
                    className={styles.detailAvatar}
                  />
                ) : (
                  <div className={styles.detailAvatar}>
                    {getInitials(profiles[selectedConversation.userId]?.username || "?")}
                  </div>
                )}
                <div className={styles.detailUserInfo}>
                  <div className={styles.detailUserName}>
                    {profiles[selectedConversation.userId]?.username || "Ismeretlen"}
                  </div>
                </div>
              </div>

              <div className={styles.chatArea}>
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.isFromCurrentUser
                        ? styles.messageBubbleRight
                        : styles.messageBubbleLeft
                    }
                  >
                    <div className={styles.messageBubbleContent}>
                      {message.content}
                    </div>
                    <div className={styles.messageBubbleTime}>
                      {formatDate(message.sent_at)}
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>

              <div className={styles.messageActions}>
                <button
                  className={`${styles.actionBtn} ${styles.replyBtn}`}
                  onClick={() => setShowReplyModal(true)}
                >
                  Válasz
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={handleDeleteConversation}
                >
                   Beszélgetés törlése
                </button>
              </div>
            </>
          ) : (
            <div className={styles.emptyDetail}>
              <div className={styles.emptyText}>
                Válassz ki egy beszélgetést a listából
              </div>
            </div>
          )}
        </div>
      </div>

      {showReplyModal && (
        <div className={styles.modalOverlay} onClick={() => { setShowReplyModal(false); setNewMessageRecipient(null); }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              {newMessageRecipient 
                ? `Üzenet küldése: ${newMessageRecipient.name}` 
                : `Üzenet küldése: ${profiles[selectedConversation?.userId]?.username}`}
            </div>
            <div className={styles.modalBody}>
              {newMessageRecipient?.adTitle && (
                <div>
                  Hirdetés: <strong>{newMessageRecipient.adTitle}</strong>
                </div>
              )}
              <textarea
                ref={replyTextRef}
                className={styles.modalTextarea}
                placeholder="Írd ide az üzeneted..."
                autoFocus
              />
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => { setShowReplyModal(false); setNewMessageRecipient(null); }}
              >
                Mégse
              </button>
              <button className={styles.modalSendBtn} onClick={handleSendReply}>
                Küldés
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}