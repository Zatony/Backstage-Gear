import viewAd from "./viewAd.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuthToken } from "../util/auth";

export default function ViewAd() {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");
  const [getAd, setGetAd] = useState([]);
  const [userData, setUserData] = useState([]);
  const [inCart, setInCart] = useState(false);
  const [isMyAd, setIsMyAd] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = getAuthToken();
  const nav = useNavigate();
  
  useEffect(() => {
    if (!token || !getAd.user_id) {
      setIsMyAd(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsMyAd(payload.id === getAd.user_id);
    } catch {
      setIsMyAd(false);
    }
  }, [token, getAd.user_id]);


  useEffect(() => {
    async function fetchAd() {
      try {

        const response = await fetch(`http://localhost:3000/backstagegear/ads/${queryId}`);

        const resData = await response.json();
        if (response.ok) 
          setGetAd(resData[0]);

        console.log("Hirdetés adatai: ", resData);
      } catch (err) {
        console.error("Hiba a hirdetés lekérésekor: ", err);
      }
    }
    fetchAd();
  }, [queryId]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!getAd.user_id) 
          return;

        const response = await fetch(`http://localhost:3000/backstagegear/profiles/${getAd.user_id}`);

        const resData = await response.json();
        if (response.ok) 
          setUserData(resData);

        console.log("Felhasználói: ", resData);
      } catch (err) {
        console.error("Hiba a felhasználói adatok lekérésekor: ", err);
      }
    }
    fetchUserData();
  }, [getAd.user_id]);

  useEffect(() => {
    async function checkInCart() {
      if (!token || !getAd.id) {
        setInCart(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/backstagegear/me/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });
        
        if (response.ok) {
          const cartItems = await response.json();
          setInCart(cartItems.some(item => item.id === getAd.id));
        }
      } catch (err) {
        setInCart(false);
      }
    }
    checkInCart();
  }, [token, getAd.id]);

  async function handleToggle() {
    if (!token || !getAd.id) {
      alert("Jelentkezz vagy regisztrálj a művelethez!");
      return;
    }
    setLoading(true);
    if(isMyAd) {
      return;
    }
    try {
      if (inCart) {
        await fetch(`http://localhost:3000/backstagegear/me/cart/${getAd.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });
        setInCart(false);
        window.dispatchEvent(new Event('cartChanged'));
      } else {
        await fetch(`http://localhost:3000/backstagegear/me/cart/ads/${getAd.id}`, {
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

  async function handleReport() {
    if (!token || !getAd.id) {
      alert("Jelentkezz vagy regisztrálj a művelethez!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/backstagegear/me/ads/${getAd.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        }
      });
      console.log("Jelentés válasza: ", response);
      if (response.ok) {
        alert("A hirdetés sikeresen jelentve lett.");
        return nav("/")
      } else {
        alert("Hiba történt a hirdetés jelentése során.");
      }
    } catch (err) {
      console.error("Hiba történt a hirdetés jelentése során: ", err);
    }
  }

  async function handleDeleteAd(adId) {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a hirdetést?")) 
        return;
    try {
      const response = await fetch(`http://localhost:3000/backstagegear/me/my_ads/${adId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        alert("Hirdetés sikeresen törölve.");
        nav("/my_ads");
      }
    } catch (err) {
      console.error("Hiba a hirdetés törlésekor:", err);
    }
  }

  return (
    <div className={viewAd.viewAdContainer}>
      <div className={viewAd.adCardColumn}>
        <div className={viewAd.adInfoBlock}>
          <div className={viewAd.adImageAndUser}>
            <img
              src={getAd.files}
              alt={getAd.item_name}
              className={viewAd.mainImg}
            />
            <div className={viewAd.userRow}>
              <img
                className={viewAd.userIcon}
                src={userData.profile_picture}
                alt={userData.username}
              />
              <span className={viewAd.username}>{userData.username}</span>
            </div>
            <div className={viewAd.ratingRow}>
              <span
                className={viewAd.rating}
              >{`Értékelés: +${userData.up_votes} | -${userData.down_votes}`}</span>
            </div>
          </div>
          <div className={viewAd.adTextBlock}>
            <h2 className={viewAd.adTitle}>{getAd.item_name}</h2>
            <div className={viewAd.adMeta}>
              {getAd.date_of_ad !== undefined && getAd.date_of_ad !== null
                ? getAd.date_of_ad.substring(0, 16)
                : "-"}
            </div>
            <div className={viewAd.adDescBlock}>
              <div
                className={viewAd.adDescLabel}
              >{`Állapot: ${getAd.item_condition}`}</div>
              <div className={viewAd.adDescLabel}>Leírás:</div>
              <div className={viewAd.adDescText}>{getAd.description}</div>
            </div>
          </div>
        </div>
        <div className={viewAd.priceButtonsFullWidth}>
          <span className={viewAd.price}>
            {getAd.price !== undefined && getAd.price !== null
              ? getAd.price.toLocaleString("hu-HU")
              : "-"}{" "}
            Ft
          </span>
          <div className={viewAd.buttonRow}>
            {isMyAd && (
              <>
                <button
                  onClick={handleToggle}
                  className={ isMyAd ? viewAd.myAd : inCart ? viewAd.inCart : viewAd.notInCart }>
                  {isMyAd ? "Módosítás" : inCart ? "Eltávolítás a kosárból" : "Kosárba"}
                </button>
                <button onClick={() => handleDeleteAd(getAd.id)} className={viewAd.reportBtn}>
                  Hirdetés törlése
                </button>
              </>
            )}

            {!isMyAd && (
              <>
                <button onClick={handleReport} className={viewAd.reportBtn}>
                  Hirdetés jelentése
                </button>
                <button className={viewAd.reachOutBtn}>Érdeklődés</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
