export default function MessageEmptyState({ page }) {
  return (
    <div className={page.emptyDetail}>
      <div className={page.emptyText}>
        Válassz ki egy beszélgetést a listából
      </div>
    </div>
  );
}
