import { useEffect, useState } from 'react';
import Ad from '../components/ad';
import list from './list.module.css';
import { getAuthToken } from '../util/auth';

export default function List() {
  const token = getAuthToken();
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch("http://localhost:3000/backstagegear/me/cart", {
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
        }
      } catch (err) {
        console.error("Hiba történt a felhasználói adatok lekérése során: ", err);
      }
    }

    fetchItems();
  }, [token]);

  return (
    <>
      <div className={list.listTextContainer}>
        <h1 className={list.listText}>Kívánságlista</h1>
        <div className={list.listLine}></div>
      </div>

      <div className="container">
        {items.length === 0 ? <p className={list.emptyText}>Üres lista</p> : items.map((item) => (
          <Ad key={item.id} adId={item.id} adName={item.name} adDesc={item.description} adImg={item.files[0]} adPrice={item.price} page={list} cartIds={items.map(i => i.id)} />
        ))}
      </div>

    </>
  )
}