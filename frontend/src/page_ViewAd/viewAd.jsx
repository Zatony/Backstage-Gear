import viewAd from "./viewAd.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuthToken } from "../util/auth";
import ItemImage from "../components/UserData.jsx";
import ItemDetails from "../components/ItemDetails.jsx";
import ItemActions from "../components/viewAdButtons.jsx";

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
      alert("Jelentkezz be vagy regisztrálj a művelethez!");
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
      alert("Jelentkezz be vagy regisztrálj a művelethez!");
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

  const handleEditAd = (adId) => {
    console.log(adId);
    nav(`/edit_ad?id=${adId}`);
  };

  function handleMessageClick(userId, username, adTitle){
    if(!token) {
      alert("Jelentkezz be vagy regisztrálj a művelethez!");
      return;
    }
    else{
      nav("/message", { 
        state: { 
          recipientId: userId, 
          recipientName: username,
          adTitle: adTitle
        } 
      });
    }
  };

  return (
    <div className={viewAd.viewAdContainer}>
      <div className={viewAd.adCardColumn}>
        <div className={viewAd.adInfoBlock}>
          <ItemImage page={viewAd} ad={getAd} userData={userData} />
          <ItemDetails page={viewAd} ad={getAd} />
        </div>
        <ItemActions
          page={viewAd}
          ad={getAd}
          userData={userData}
          isMyAd={isMyAd}
          inCart={inCart}
          loading={loading}
          onToggleCart={handleToggle}
          onReport={handleReport}
          onDelete={handleDeleteAd}
          onEdit={handleEditAd}
          onMessage={handleMessageClick}
        />
      </div>
    </div>
  );
}
