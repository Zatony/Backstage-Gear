export default function ItemActions({ page, ad, userData, isMyAd, inCart, loading, onToggleCart, onReport, onDelete, onEdit, onMessage }) {
  return (
    <div className={page.priceButtonsFullWidth}>
      <span className={page.price}>
        {ad.price !== undefined && ad.price !== null
          ? ad.price.toLocaleString("hu-HU")
          : "-"}{" "}
        Ft
      </span>
      <div className={page.buttonRow}>
        <button
          onClick={() => (isMyAd ? onEdit(ad.id) : onToggleCart())}
          className={
            isMyAd ? page.myAd : inCart ? page.inCart : page.notInCart
          }
          disabled={loading}
        >
          {isMyAd ? "Módosítás" : inCart ? "Eltávolítás a kívánságlistáról" : "Kívánságlistára tűzés"}
        </button>

        {isMyAd ? (
          <button
            onClick={() => onDelete(ad.id)}
            className={page.reportBtn}
            disabled={loading}
          >
            Hirdetés törlése
          </button>
        ) : (
          <>
            <button
              onClick={onReport}
              className={page.reportBtn}
              disabled={loading}
            >
              Hirdetés jelentése
            </button>
            <button
              className={page.reachOutBtn}
              onClick={() =>
                onMessage(ad.user_id, userData.username, ad.item_name)
              }
              disabled={loading}
            >
              Érdeklődés
            </button>
          </>
        )}
      </div>
    </div>
  );
}
