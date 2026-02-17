    export default function MessageActions({ page, onOpenReply, onDeleteConversation, }) {
  return (
    <div className={page.messageActions}>
      <button
        className={`${page.actionBtn} ${page.replyBtn}`}
        onClick={onOpenReply}
      >
        Válasz
      </button>
      <button
        className={`${page.actionBtn} ${page.deleteBtn}`}
        onClick={onDeleteConversation}
      >
        Beszélgetés törlése
      </button>
    </div>
  );
}
