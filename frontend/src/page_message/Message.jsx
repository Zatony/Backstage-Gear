import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import message from "./message.module.css";
import ConversationsList from "../components/ConversationsList.jsx";
import ConversationHeader from "../components/ConversationHeader.jsx";
import ChatMessages from "../components/ChatMessages.jsx";
import MessageActions from "../components/MessageActions.jsx";
import MessageModal from "../components/MessageModal.jsx";
import MessageEmptyState from "../components/MessageEmptyState.jsx";
import { getAuthToken, getAuthUserId } from "../util/auth";

const getCurrentUserId = () => {
  return getAuthUserId();
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

  const token = getAuthToken();

  useEffect(() => {
    fetchMessages();
  }, [token]);

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

    if (!token) {
      setIncomingMessages([]);
      setSentMessages([]);
      setProfiles({});
      setConversations([]);
      setSelectedConversation(null);
      setLoading(false);
      return;
    }

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
  
  const handleSendReply = async (messageText) => {
    if (!messageText || !messageText.trim()) return;

    const recipientId = newMessageRecipient?.id || selectedConversation?.userId;
    if (!recipientId) return;

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

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  function getInitials(name) {
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
      <div className={message.messageTextContainer}>
        <h1 className={message.messageTitle}>Üzeneteim</h1>
        <div className={message.messageLine}></div>
      </div>

      <div className={message.messageContainer}>
        <ConversationsList
          page={message}
          conversations={conversations}
          profiles={profiles}
          selectedConversation={selectedConversation}
          loading={loading}
          onSelectConversation={setSelectedConversation}
          formatDate={formatDate}
          getInitials={getInitials}
        />

        <div className={message.messageDetail}>
          {selectedConversation ? (
            <>
              <ConversationHeader
                page={message}
                selectedConversation={selectedConversation}
                profiles={profiles}
                getInitials={getInitials}
              />

              <ChatMessages
                page={message}
                selectedConversation={selectedConversation}
                formatDate={formatDate}
              />

              <MessageActions
                page={message}
                onOpenReply={() => setShowReplyModal(true)}
                onDeleteConversation={handleDeleteConversation}
              />
            </>
          ) : (
            <MessageEmptyState page={message} />
          )}
        </div>
      </div>

      <MessageModal
        page={message}
        showReplyModal={showReplyModal}
        newMessageRecipient={newMessageRecipient}
        selectedConversation={selectedConversation}
        profiles={profiles}
        onClose={() => {
          setShowReplyModal(false);
          setNewMessageRecipient(null);
        }}
        onSend={handleSendReply}
      />
    </>
  );
}