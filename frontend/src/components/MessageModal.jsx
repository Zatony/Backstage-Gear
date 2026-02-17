import { useRef } from "react";

export default function MessageModal({ page, showReplyModal, newMessageRecipient, selectedConversation, profiles, onClose, onSend }) {
  const replyTextRef = useRef(null);

  const handleSend = () => {
    onSend(replyTextRef.current?.value.trim());
    replyTextRef.current.value = "";
  };

  if (!showReplyModal) return null;

  return (
    <div className={page.modalOverlay} onClick={() => { onClose(); }}>
      <div className={page.modal} onClick={(e) => e.stopPropagation()}>
        <div className={page.modalHeader}>
          {newMessageRecipient 
            ? `Üzenet küldése: ${newMessageRecipient.name}` 
            : `Üzenet küldése: ${profiles[selectedConversation?.userId]?.username}`}
        </div>
        <div className={page.modalBody}>
          {newMessageRecipient?.adTitle && (
            <div>
              Hirdetés: <strong>{newMessageRecipient.adTitle}</strong>
            </div>
          )}
          <textarea
            ref={replyTextRef}
            className={page.modalTextarea}
            placeholder="Írd ide az üzeneted..."
            autoFocus
          />
        </div>
        <div className={page.modalActions}>
          <button
            className={page.modalCancelBtn}
            onClick={() => { onClose(); }}
          >
            Mégse
          </button>
          <button className={page.modalSendBtn} onClick={handleSend}>
            Küldés
          </button>
        </div>
      </div>
    </div>
  );
}
