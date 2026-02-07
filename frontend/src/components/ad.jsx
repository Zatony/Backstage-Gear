import { useEffect, useState } from "react";
import { getAuthToken } from "../util/auth";

export default function Ad({ adName, adDesc, adImg, adPrice, page, adId, cartIds = [] }) {
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInCart(cartIds.includes(adId));
  }, [adId, cartIds]);

  async function handleToggleCart() {
    const token = getAuthToken();
    if (!token || !adId) return;
    setLoading(true);
    try {
      if (inCart) {
        await fetch(`http://localhost:3000/backstagegear/me/cart/${adId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });
        setInCart(false);
      } else {
        await fetch(`http://localhost:3000/backstagegear/me/cart/ads/${adId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });
        setInCart(true);
      }
    } catch (err) {
      console.error("Hiba történt a kosár frissítése során: ", err);
    }
    setLoading(false);
  }

  return (
    <div className={page.ad}>
        <img src={adImg} alt={adImg} />

      <div className={page.adText_Button}>
        <h3>{adName}</h3>
        <div className="row">
          <div className={`${page.adDescPriceBtn} col-sm-12 col-md-6 col-lg-4`}>
            <p>{adDesc}</p>
          </div>

          <div className={`${page.priceButtonGroup} col-sm-12 col-md-6 col-lg-4 align-text-bottom`}>
            <h2>{adPrice.toLocaleString("hu-HU")} Ft</h2>
            <button onClick={handleToggleCart} disabled={loading}>
              {inCart ? "asd" : "Kosárba"}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
