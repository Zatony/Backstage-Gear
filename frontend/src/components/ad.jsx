import { useEffect, useState } from "react";
import { getAuthToken } from "../util/auth";
import { useNavigate } from "react-router-dom";

export default function Ad({ adName, adDesc, adImg, adPrice, page, adId, cartIds = [], myAdIds = [] }) {
  const [inCart, setInCart] = useState(false);
  const [isMyAd, setIsMyAd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(getAuthToken());
  const nav = useNavigate();
  useEffect(() => {
    function handleAuthChange() {
      setToken(getAuthToken());
    }
    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  useEffect(() => {
    if (!token) {
      setInCart(false);
      setIsMyAd(false);
      return;
    }
    if(cartIds.length > 0)
      setInCart(cartIds.includes(adId));

    setIsMyAd(myAdIds.includes(adId));
  }, [adId, myAdIds, cartIds, token]);

  async function handleToggle() {
    if (!token || !adId) {
      alert ("Jelentkezz be vagy regisztrálj a művelethez!");
      return;
    }
    setLoading(true);
    if (isMyAd) {
      nav(`/edit_ad?id=${adId}`)
      return;
    }
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
        window.dispatchEvent(new Event('cartChanged'));
      } else {
        await fetch(`http://localhost:3000/backstagegear/me/cart/ads/${adId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });
        setInCart(true);
        window.dispatchEvent(new Event('cartChanged'));
      }
    } catch (err) {
      console.error("Hiba történt a kosár frissítése során: ", err);
    }
    setLoading(false);
  }
  
  function handleAdClick(e) {
    if (e.target.closest('button')) return;
    nav(`/product?id=${adId}`);
  }
  return (
    <div className={page.ad} onClick={handleAdClick} style={{cursor: 'pointer'}}>
      <img src={adImg} alt={adName} />
      <div className={page.adText_Button}>
        <h3>{adName}</h3>
        <div className={page.adDescPriceBtn}>
          <p>{adDesc}</p>
          <div className={page.priceButtonGroup}>
            <h2>{adPrice.toLocaleString("hu-HU")} Ft</h2>
            <button
              onClick={e => { e.stopPropagation(); handleToggle(); }}
              disabled={loading}
              className={inCart ? page.inCart : isMyAd ? page.myAd : page.notInCart}
            >
              {inCart ? "Eltávolítás a kívánságlistáról" : isMyAd ? "Módosítás" : "Kívánságlistára tűzés"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
