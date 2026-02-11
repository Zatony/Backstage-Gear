import { useEffect, useState } from 'react';
import Ad from '../components/ad';
import list from './list.module.css';
import { getAuthToken } from '../util/auth';

export default function List() {
  const [items, setItems] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [token, setToken] = useState(getAuthToken());

  useEffect(() => {
    function handleAuthChange() {
      setToken(getAuthToken());
      fetchCart();
      fetchItems();
    }
    window.addEventListener("authChanged", handleAuthChange);
    window.addEventListener("cartChanged", handleAuthChange);
    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
      window.removeEventListener("cartChanged", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    fetchCart();
    fetchItems();
  }, [token]);

  async function fetchCart() {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setCartIds([]);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/backstagegear/me/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": currentToken
        }
      });
      if (response.ok) {
        const cartItems = await response.json();
        setCartIds(cartItems.map((item) => item.id));
      }
    } catch (err) {
      setCartIds([]);
    }
  }

  async function fetchItems() {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setItems([]);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/backstagegear/me/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": currentToken
        }
      });
      const resData = await response.json();
      if (response.ok) {
        setItems(resData);
      }
    } catch (err) {
      setItems([]);
    }
  }

  return (
    <>
      <div className={list.listTextContainer}>
        <h1 className={list.listText}>Kívánságlista</h1>
        <div className={list.listLine}></div>
      </div>

      <div className="container">
        {items.length === 0 ? <p className={list.emptyText}>Üres lista</p> : items.map((item) => (
          <Ad key={item.id} adId={item.id} adName={item.name} adDesc={item.description} adImg={item.files[0]} adPrice={item.price} page={list} cartIds={cartIds} />
        ))}
      </div>
    </>
  );
}