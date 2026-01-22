import { useEffect, useState } from 'react';
import Ad from '../components/ad';
import list from './list.module.css';

export default function List(){
  const isLoggedIn = !!sessionStorage.getItem('token');
  const [items, setItems] = useState([]);

  useEffect(() => {
      if(!isLoggedIn){

        return;
      } 
  
      const token = sessionStorage.getItem('token');
  
      async function fetchItems() {
        try{
          const response = await fetch("http://localhost:3000/backstagegear/me/cart", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token
            }
          });
  
          const resData = await response.json();
          console.log(resData);
          if(response.ok){
            setItems(resData);
          }
        } catch(err){
          console.error("Hiba történt a felhasználói adatok lekérése során: ", err);
        }
    }

    fetchItems();
  }, [isLoggedIn]);

  return(
    <main>
        <h1>Kívánságlista</h1>
        <div className="container">
            {items.length === 0 ? <p>üres a lista</p>: items.map((item) => (
            <Ad key={item.id} adName={item.name} adDesc={item.description} adImg={item.files[0]} adPrice={item.price} page={list} inCart={true}/>
            ))}
        </div>
        
    </main>
  )
}