export default function ItemDetails({ page, ad }) {
  return (
    <div className={page.adTextBlock}>
      <h2 className={page.adTitle}>{ad.item_name}</h2>
      <div className={page.adMeta}>
        {ad.date_of_ad !== undefined && ad.date_of_ad !== null
          ? ad.date_of_ad.substring(0, 16)
          : "-"}
      </div>
      <div className={page.adDescBlock}>
        <div
          className={page.adCondLabel}
        >{`Állapot: ${ad.item_condition}`}</div>
        <div className={page.adDescLabel}>Leírás:</div>
        <div className={page.adDescText}>{ad.description}</div>
      </div>
    </div>
  );
}
