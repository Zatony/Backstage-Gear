import { useEffect, useState } from 'react';
import Ad from '../components/ad';
import myAds from './myAds.module.css';
import { getAuthToken } from '../util/auth';

export default function MyAds() {
  const token = getAuthToken();
  const [items, setItems] = useState([]);
  const [myAdIds, setMyAdIds] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch("http://localhost:3000/backstagegear/me/my_ads", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });

        const resData = await response.json();
        console.log(resData);
        if (response.ok) {
          setItems(resData);
          setMyAdIds(resData.map((item) => item.id));
        }
      } catch (err) {
        console.error("Hiba történt a felhasználói adatok lekérése során: ", err);
      }
    }

    fetchItems();
  }, [token]);

  return (
    <>
      <div className={myAds.myAdsTextContainer}>
        <h1 className={myAds.myAdsText}>Hirdetéseim</h1>
        <div className={myAds.myAdsLine}></div>
      </div>

      <div className="container">
        {items.length === 0 ? <p className={myAds.emptyText}>Üres lista</p> : items.map((item) => (
          <Ad key={item.id} adId={item.id} adName={item.name} adDesc={item.description} adImg={item.files[0]} adPrice={item.price} page={myAds} myAdIds={myAdIds}/>
        ))}
      </div>

    </>
  )
}